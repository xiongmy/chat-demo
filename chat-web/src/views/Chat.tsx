import { useState, useRef, useEffect, use } from "react";
import {
  RobotOutlined,
  UserOutlined,
  CopyOutlined,
  ClearOutlined,
  LinkOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Bubble, Sender, Welcome } from "@ant-design/x";
import type { BubbleProps } from "@ant-design/x";
import { message, Upload, Button, Image } from "antd";
import markdownit from "markdown-it";
import { BubbleType } from "./../props";
import { timestampToLocal } from "./../utils";
import {
  sendMessage,
  pullMessageId,
  getAgentMessage,
  interruptMessage,
  clearAgentMessage,
  uploadImageHandle,
  sendVision,
} from "./../http";
import { BASE_URL } from "./../http/config";
import "./Chat.css";
import welcomePng from "./../assets/welcome.png";
import Title from "./../components/Title";
import type { GetProp, UploadProps, UploadFile } from "antd";
import BubbleImage from "../components/BubbleImage";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const md = markdownit({ html: true, breaks: true });
const renderMarkdown: BubbleProps["messageRender"] = (content) => (
  <div>
    {content ? (
      <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
    ) : (
      <div>...</div>
    )}
  </div>
);
const renderImage: BubbleProps["messageRender"] = (name) => (
  <div>{name ? <BubbleImage url={name} /> : ""}</div>
);

const Chat = ({ agent = "coco", mode = "" }) => {
  const [content, setContent] = useState("");
  const [bubbles, setBubbles] = useState<BubbleType[]>([]);
  const [streamBubble, setStreamBubble] = useState<BubbleType[]>([]);
  const [senderLoading, setSenderLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [showWelcome, setShowWelcome] = useState(true);

  const messageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      receiveMsg();
    }, 1000);
    updateBubbles();
    return () => {
      clearInterval(timer);
    };
  }, []);
  useEffect(() => {
    updateBubbles();
  }, [mode]);
  useEffect(() => {
    if (messageRef.current !== null) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }, [bubbles, streamBubble]);
  const updateBubbles = async () => {
    const { messages } = await getAgentMessage(agent);
    if (messages.length) setShowWelcome(false);
    const list = messages.map((msg: any) => {
      return {
        role: msg.role,
        content: msg.type === "image" ? msg.attrs.image_files[0] : msg.content,
        msgId: msg.msg_id,
        created: msg.created,
        type: msg.type || 'text',
      };
    });
    setBubbles([...list]);
    setStreamBubble([]);
  };
  const sendMsg = async (content: string) => {
    if (streamBubble.length > 0) {
      // 消息中断
      await interruptMessage(agent);
    }
    await sendMessage(content);
    setStreamBubble([
      { role: "user", content, created: Math.floor(Date.now() / 1000) },
    ]);
    setSenderLoading(true);
    setTimeout(() => {
      setSenderLoading(false);
    }, 1000);
  };
  const receiveMsg = async () => {
    let msgId = "";
    msgId = await pullMessageId();
    let msgRole = "";
    if (msgId) {
      // 3. 获取消息内容
      let fullContent = "";
      let done = false;
      let created = 0;
      while (!done) {
        const response = await fetch(
          `${BASE_URL}/messages/agents/${agent}/pull`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ msg_id: msgId }), // 需要获取内容的消息唯一标识符
          }
        );

        const data = await response.json();
        if (data.chunk) {
          msgRole = data.chunk.role;
          if (data.chunk && data.chunk.type === "image") {
            done = true;
            if (data.chunk.attrs.image_files.length) {
              const name = data.chunk.attrs.image_files[0];
              fullContent = name;
            }
          } else {
            if (data.chunk.seq === "complete") {
              done = true;
              fullContent = data.chunk.content; // 消息文本内容
              created = data.chunk.created;
              console.log(data.chunk.msg_id+','+data.chunk.role)
            } else {
              fullContent += data.chunk.content; // 消息文本内容
            }
          }

          setStreamBubble([
            {
              role: msgRole,
              content: fullContent,
              id: data.chunk.msg_id,
              created,
            },
          ]);
        }
      }
      const list = [
        ...streamBubble,
        { role: msgRole, content: fullContent, id: msgId, created },
      ];
      setBubbles((bubbles) => [...bubbles, ...list]);
      setStreamBubble([]);
    }
  };
  const clearMessages = () => {
    interruptMessage(agent);
    clearAgentMessage(agent).then(() => {
      messageApi.info("已清空");
      setBubbles([]);
      setStreamBubble([]);
    });
  };
  const copyContent = (text: string) => {
    if ("clipboard" in navigator) {
      // clipboard API可用
      navigator.clipboard.writeText(text).then(
        () => {
          messageApi.success("复制成功");
        },
        (err) => {
          messageApi.error("Failed to copy text: ", err);
        }
      );
    } else {
      // 剪贴板API不可用
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand("copy");
        messageApi.success("复制成功");
      } catch (err) {
        messageApi.error("Failed to copy text: ", err);
      }
      document.body.removeChild(textarea);
    }
  };
  const afterInput = (msg: string) => {
    if (showWelcome) setShowWelcome(false);
    setContent("");
    if (fileList.length > 0) {
      sendFile(msg);
    } else {
      sendMsg(msg);
    }
  };
  const sendFile = async (msg: string) => {
    let filename = "";
    const formData = new FormData();
    formData.append("file", fileList[0] as FileType);
    // setUploading(true);
    await uploadImageHandle(formData)
      .then((res) => res.json())
      .then((res) => {
        filename = res.filename;
      })
      .catch(() => {
        message.error("upload failed.");
      });
    if (filename) {
      await sendVision(filename);
      sendMsg(msg);
      setImgUrl("");
      setFileList([]);
    }
  };
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imgUrl, setImgUrl] = useState("");
  const clearFileList = () => {
    setFileList([]);
  };
  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file, fileList) => {
      setFileList(fileList);

      return false;
    },
    onChange: (info) => {
      getBase64(info.file as FileType, (url) => {
        setImgUrl(url);
      });
    },
    fileList,
    // showUploadList: false,
  };
  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };
  const bubbleEle = (list: BubbleType[]) => {
    const elements = list.map((bubble, i) => (
      <Bubble
        key={i}
        placement={bubble.role === "assistant" ? "start" : "end"}
        content={bubble.content}
        messageRender={bubble.type === "image" ? renderImage : renderMarkdown}
        header={
          <p className={"text-xs"}>
            {timestampToLocal(bubble.created as number)}
          </p>
        }
        footer={
          <div className="text-gray-500 text-xs">
            <CopyOutlined
              style={{ fontSize: "12px" }}
              onClick={() => copyContent(bubble.content as string)}
            />
          </div>
        }
        avatar={{
          icon:
            bubble.role === "assistant" ? <RobotOutlined /> : <UserOutlined />,
          style: {
            background: bubble.role === "assistant" ? "#fde3cf" : "#87d068",
          },
        }}
        style={{ marginBottom: "5px" }}
      />
    ));

    return elements;
  };
  return (
    <div className="w-full h-full relative">
      {contextHolder}
      <Title text="AI会话">
        <div className="text-sm leading-8 ml-4">
          <ClearOutlined
            className="mr-2 clear-btn"
            onClick={() => clearMessages()}
          />
        </div>
      </Title>
      <div
        ref={messageRef}
        className="bubble-list m-2 rounded-sm p-2 overflow-y-auto overflow-x-hidden"
      >
        {bubbleEle(bubbles)}
        {bubbleEle(streamBubble)}
      </div>
      {bubbles.length === 0 && streamBubble.length === 0 ? (
        <div className="w-3/5 m-auto my-2">
          <Welcome
            icon={<img src={welcomePng} />}
            title="你好"
            description="欢迎开启美好的一天，希望能帮助你"
          />
        </div>
      ) : (
        ""
      )}
      <div className="w-4/5 absolute bottom-0 sender-box" style={{ left: "10%" }}>
        <div className="upload-box">
          {fileList.length === 0 ? (
            <Upload {...props}>
              <Button
                className="mt-4"
                icon={<LinkOutlined />}
                type="link"
                size="small"
              ></Button>
            </Upload>
          ) : (
            <div>
              <span className="relative">
                <img src={imgUrl} style={{ width: "40px", height: "40px" }} />
                <CloseCircleOutlined
                  className="absolute -top-1 left-8 cursor-pointer"
                  style={{ fontSize: "12px" }}
                  onClick={clearFileList}
                />
              </span>
            </div>
          )}
        </div>
        <Sender
          style={{
            maxWidth: "500px",
            margin: "0 auto",
          }}
          value={content}
          loading={senderLoading}
          onChange={setContent}
          onSubmit={(nextContent) => {
            afterInput(nextContent);
          }}
        />
        <p className="text-center text-xs ">
          {new Date().getFullYear() +
            "." +
            (new Date().getMonth() + 1) +
            "." +
            new Date().getDate()}
        </p>
      </div>
    </div>
  );
};

export default Chat;
