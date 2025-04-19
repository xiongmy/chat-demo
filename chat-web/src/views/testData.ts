const  baseData = {
    
    "id": "coco",
    "name": "test_agent",
    "description": "Test Agent",
    "driver": "coco_project.application.agents.main_agent:MainAgent",
    "default": "default",
    "modes": {
        "default": {
            "type": "coco_project.framework.agent.drivers.speech_mode:SpeechChatAgentModeConfig",
            "data": {
                "llm_api": "gpt-4o"
            }
        },
        "vision_chat_mode": {
            "type": "coco_project.framework.agent.drivers.vision_chat_mode:VisionChatAgentModeConfig",
            "data": {
                "instruction": "你是coco蜘蛛机器人,拥有一个客观存在的物理实体，面部有一个前置摄像头，现在用户在和你聊天，照片信息是你看到的景象，不一定有用，只作为辅助信息，不需要对照片进行解释性发言。仅当用户内容涉及视觉时，才需要提高对照片的关注度。",
                "llm_api": "gpt-4o"
            }
        }
    },
    "max_idle_time": 0.0,
    "event_interval": 0.05,
    "max_error_time": 10
    
}
export default  baseData