# 王者荣耀英雄战力榜 API

## API 地址

```
https://kohcamp.qq.com/honor/ranklist
```

## 请求头

```json
{
  "token": "gUXGbSGyX1B4-3MqwNEcc7tCmiW7fyxqBC9hGaogRkt04V0aMpU2LLdxztQk_TZAGb_-oDnKUzdy-7twu1uqrDvyLMarvfHy",
  "userId": "97037262",
  "User-Agent": "Mozilla/5.0 (Linux; Android 14; PLR110 Build/UKQ1.230917.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/121.0.6167.178 Mobile Safari/537.36",
  "Content-Type": "application/json",
  "Accept": "*/*",
  "Host": "kohcamp.qq.com",
  "Connection": "keep-alive"
}
```

## 请求体

```json
{
  "recommendPrivacy": "0", // 未知，可保持为 0
  "areaId": "1", // 大区 ID，可填 1(QQ 安卓), 2(QQ iOS), 3(微信 安卓), 4(微信 iOS)
  "adcode": "210400", // 行政区划代码
  "roleId": "xxxx", // 自己的 roleId（抓包获取）
  "heroId": "168" // 英雄 ID：168 代表韩信
}
```

## 响应体

```json
{
  "result": 0,
  "returnCode": 0,
  "returnMsg": "",
  "data": {
    "list": [
      {
        "rankNo": 1,
        "roleId": "222688734",
        "roleIcon": "https://thirdqq.qlogo.cn/ek_qqapp/AQLCOYZYTIYXOrgyDxCDAgiaHjltXAicF3XEMNfZjjSl9qhUYGJ8noF6Z8VJpoibY3NnzLV2zR0sAw6vTnQ0sThzJA15OZHtyo96U6JrdpcFIGGs2nfBiaw/100",
        "roleName": ".吴宣怡.",
        "roleJobName": "荣耀王者",
        "rankValue": "9949",
        "rankChange": "0",
        "rankValChange": "0",
        "userId": "235759558",
        "userName": "235759558",
        "serverId": 1172,
        "openid": "",
        "areaId": 1,
        "isHide": false
      },
      {
        "rankNo": 2,
        "roleId": "131329372",
        "roleIcon": "https://thirdqq.qlogo.cn/ek_qqapp/AQCMzFYybEK3s0MRmkvOALhjO7BFtrvIGCpUeQevBz9Jvfw9duwcR0W7giaEP4ERROu9b83Ly6jU33jEibaoez8RLO1YFmtnM3HBHIJCBQS1Rtk8pgXwg/100",
        "roleName": "⁣⁣⁣重楼",
        "roleJobName": "传奇王者",
        "rankValue": "9567",
        "rankChange": "0",
        "rankValChange": "0",
        "userId": "350074395",
        "userName": "Corner7FZ",
        "serverId": 1059,
        "openid": "",
        "areaId": 1,
        "isHide": false
      }
      // ...
    ],
    "total": 100,
    "updateTime": "1773363026"
  }
}
```

## 示例

```bash
curl --location --request POST 'https://kohcamp.qq.com/honor/ranklist' \
--header "token: gUXGbSGyX1B4-3MqwNEcc7tCmiW7fyxqBC9hGaogRkt04V0aMpU2LLdxztQk_TZAGb_-oDnKUzdy-7twu1uqrDvyLMarvfHy" \
--header "userId: 97037262" \
--header 'User-Agent: Mozilla/5.0 (Linux; Android 14; PLR110 Build/UKQ1.230917.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/121.0.6167.178 Mobile Safari/537.36' \
--header 'Content-Type: application/json' \
--header 'Accept: */*' \
--header 'Host: kohcamp.qq.com' \
--header 'Connection: keep-alive' \
--data-raw "{
    \"recommendPrivacy\": \"0\",
    \"areaId\": \"1\",
    \"adcode\": \"441200\",
    \"roleId\": \"2120721615\",
    \"heroId\": \"168\"
}"
```
