export default {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "minLength": 2,
        "title":'名字'
      },
      "address": {  // 第二层嵌套对象
        "type": "object",
        "properties": {
          "city": {
            "title":'城市',
            "type": "string",
            "enum": ["北京", "上海", "广州"]
          },
          "postcode": {
            "title":'城市代码',
            "type": "string",
            "pattern": "^[0-9]{6}$"
          }
        },
        "required": ["city", "postcode"],
        "additionalProperties": false  // 禁止额外字段
      }
    },
    "required": ["name", "address"]
  }