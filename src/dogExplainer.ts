export function explainLikeMyDog(topic: string): string {
  const cleanedTopic = topic.trim();

  if (!cleanedTopic) {
    return "Woof? Give me a topic and I'll explain it for treats.";
  }

  return [
    `🐶 Okay human, here's ${cleanedTopic}:`,
    "1) Sniff around first (gather context).",
    "2) Focus on the squeaky part (the core problem).",
    "3) Repeat with tail wags until it clicks (iterate fast)."
  ].join("\n");
}
