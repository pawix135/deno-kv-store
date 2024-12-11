# KV Store Specification

## Packet Structure

```
------------------------------------------------------
| type | key length | payload length | key | payload |
------------------------------------------------------
```

type: ```int8``` <br/>
key length: ```int16``` <br/>
payload length: ```int16``` <br/>
key: ```bytes[]``` <br/>
payload: ```bytes[]```

## Packet Types
