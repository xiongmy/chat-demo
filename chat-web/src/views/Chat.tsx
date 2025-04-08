import { useState, useRef, useEffect } from "react";
import {
  RobotOutlined,
  UserOutlined,
  CopyOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { Bubble, Sender, Welcome } from "@ant-design/x";
import type { BubbleProps } from "@ant-design/x";
import { Button, message } from "antd";
import markdownit from "markdown-it";
import { BubbleType } from "./../props";
import { timestampToLocal } from "./../utils";
import {
  sendMessage,
  pullMessageId,
  getAgentMessage,
  interruptMessage,
  clearAgentMessage,
} from "./../http";
import { BASE_URL } from "./../http/config";
import "./Chat.css";
import welcomePng from "./../assets/welcome.png";

const md = markdownit({ html: true, breaks: true });
const renderMarkdown: BubbleProps["messageRender"] = (content) => (
  <div>
    <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
  </div>
);

const Chat = ({ agent = "coco" }) => {
  const [content, setContent] = useState("");
  const [bubbles, setBubbles] = useState<BubbleType[]>([]);
  const [streamBubble, setStreamBubble] = useState<BubbleType[]>([]);
  const messageRef = useRef<HTMLInputElement>(null);
  const [senderLoading, setSenderLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [showWelcome, setShowWelcome] = useState(true);

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
    if (messageRef.current !== null) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }, [bubbles, streamBubble]);
  const updateBubbles = async () => {
    const { data } = await getAgentMessage(agent);
    if (data.messages.length) setShowWelcome(false);
    const list = data.messages.map((msg) => {
      return {
        role: msg.role,
        content: msg.content,
        msgId: msg.msg_id,
        created: msg.created,
      };
    });
    setBubbles([...list]);
  };
  const sendMsg = async (content: string) => {
    if (streamBubble.length > 0) {
      // 消息中断
      await interruptMessage(agent);
    }
    await sendMessage(content, "");
    setStreamBubble([{ role: "user", content }]);
    setSenderLoading(true);
    setTimeout(() => {
      setSenderLoading(false);
    }, 1000);
  };

  const receiveMsg = async () => {
    let msgId = null;
    msgId = await pullMessageId();
    let msgRole = "";
    if (msgId) {
      console.log("msgID: " + msgId);
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
          if (data.chunk.seq === "complete") {
            done = true;
            fullContent = data.chunk.content; // 消息文本内容
            created = data.chunk.created;
          } else {
            fullContent += data.chunk.content; // 消息文本内容
          }

          setStreamBubble([
            {
              role: data.chunk.role,
              content: fullContent,
              id: data.chunk.msg_id,
              created,
            },
          ]);
        }
      }
      // console.log("完整回复:", fullContent);
      setStreamBubble([]);
      const list = [
        ...streamBubble,
        { role: msgRole, content: fullContent, id: msgId, created },
      ];
      setBubbles((bubbles) => [...bubbles, ...list]);
    }
  };
  const clearMessages = () => {
    clearAgentMessage(agent).then(() => {
      messageApi.info("已清空");
      updateBubbles();
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
    sendMsg(msg);
  };
  const bubbleEle = (list: BubbleType[]) => {
    const elements = list.map((bubble, i) => (
      <Bubble
        key={i}
        placement={bubble.role === "assistant" ? "start" : "end"}
        content={bubble.content}
        messageRender={renderMarkdown}
        header={
          <p className={"text-xs"}>
            {timestampToLocal(bubble.created as number)}
          </p>
        }
        footer={
          <div className="text-gray-500 text-xs">
            <Button type="link" size="small">
              <CopyOutlined
                onClick={() => copyContent(bubble.content as string)}
              />
            </Button>
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
      <div className="w-full h-8 leading-8 pl-2 border-b-1 border-b-1 border-gray-300 text-base color-set">
        <div className="flex ">
          <p>AI会话</p>
          <div className="ml-4">
            <Button type="primary" size="small" onClick={() => clearMessages()}>
              <ClearOutlined />
              清空
            </Button>
          </div>
        </div>
      </div>
      <div
        ref={messageRef}
        className="m-2 rounded-sm p-2 overflow-y-auto overflow-x-hidden"
        style={{ maxHeight: "80%" }}
      >
        {bubbleEle(bubbles)}
        {bubbleEle(streamBubble)}
      </div>
      {showWelcome ? (
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
      <div className="w-4/5 absolute bottom-0 bg-white" style={{ left: "10%" }}>
        <Sender
          style={{
            maxWidth: "500px",
            margin: "0 auto",
          }}
          value={content}
          loading={senderLoading}
          allowSpeech
          onChange={setContent}
          onSubmit={(nextContent) => {
            afterInput(nextContent);
          }}
        />
        <p className="text-center ">
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
