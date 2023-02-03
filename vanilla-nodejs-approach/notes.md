quanso trabalhamos com websocket a primeira coisa que precisamos estabelecer diretamente é a conexão estavel entre browser e server, um "handshake"
para isso o cliente (browser) vai mandar uma chave, o que podemos usar para aceitar conexões especificas e indentificar o cliente
essa key chega como:
 "Sec-WebSocket-Key:"
e para finalizar nosso aperto de mãos entre o server e o cliente, o server agora precisa responder com um header especifico, contendo a chave concatenada com uma string definida pelo protocolo, encripitados com o algoritmo SHA-1 e base64.


magic string: https://en.wikipedia.org/wiki/Magic_string
