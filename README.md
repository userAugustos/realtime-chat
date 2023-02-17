## WebSockets

**No nodejs sockets são essencialmente, streams**

Então os sockets emitem eventos quando estabelecemos o handshake, com esses eventos podemos pegar a request, assistir (literalmente esperar e ver) quando o cliente está pronto, ou pegar byte por byte que precisamos para o `next()`

A Simple project with socket.io, following they docs.
In this chat, you can talk with anyone, and have the nickname, online/offline functionality

Conexão Bi lateral em tempo real.

Arquitetura baseada em eventos

socket.io funciona com dois modulos principais, um que atua no backend e monta ou serve seu nodejs, e outro que que carrega no lado do browser, servindo o cliente.

Então a Ideia principal com usar websockets é que possamos em tempo real passar quantos eventos forem necessários, com qualquer dado, por exemplo, qualquer dado em json, pode ser disparado do browser e recebido e tratado/devolvido por nossa "api". (binários também são suportados)
