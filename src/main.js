import { explainLikeMyDog } from "./dogExplainer.js";

const topic = process.argv.slice(2).join(" ") || "project setup";
console.log(explainLikeMyDog(topic));
