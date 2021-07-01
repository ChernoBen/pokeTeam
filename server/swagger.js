const swaggerAutogen = require("swagger-autogen")();
const outputFile = "./swagger_output.json";
const endpointFile = ["./server"];

swaggerAutogen(outputFile,endpointFile);