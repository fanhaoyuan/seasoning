# TreeForm 树形表单

## API

### Tree 

#### Config 配置

|配置项|类型|说明|默认值|
|--|--|--|--|
|```prefixClass```|```string```|样式的前缀|```tree-form```|
|```container```|```HTMLElemnt \|string```|渲染的容器|无|
|```data```|```ITreeNodeConfig[]```|树形表单的数据项，详情看下表|```[]```|

#### Event 事件

暂无

### TreeNode 树节点

#### Config 配置

|配置项|类型|说明|默认值|
|--|--|--|--|
|```key```|```string```|```TreeNode```的唯一标识|```--```|
|```title```|```string```|标题内容|```--```|
|```nodeType```|```'checkbox' \| 'radio' \| 'text' \| 'input'```|节点类型|```text```|
|```expand```|```boolean```|是否在展开状态|```false```|
|```checked```|```boolean```|是否在选中状态，仅在```NodeType```为```'checkbox'\|'radio'```时有效|```false```|
|```children```|```TreeNodeConfig[]```|子节点配置项|```[]```|
|```value```|```string```|输入框默认的内容，仅在```NodeType```为```'input'```时有效|```''```|
|```inputOptions```|```object```|输入框配置项，仅在```NodeType```为```'input'```时有效,详情见下表|```{}```|

#### inputOptions 输入框配置项

|配置项|类型|说明|默认值|
|--|--|--|--|
|```prefix```|```string```|输入框的前置文字|无|
|```suffix```|```string```|输入框的后置文字|无|
|```style```|```object```|输入框的样式|```{}```|

#### Event 事件

暂无
