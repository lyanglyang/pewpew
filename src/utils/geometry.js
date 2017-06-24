export function detectCollision(coordinate1, coordinate2) {
  return (coordinate1.x < coordinate2.x + coordinate2.width &&
  coordinate1.x + coordinate1.width > coordinate2.x &&
  coordinate1.y < coordinate2.y + coordinate2.height &&
  coordinate1.height + coordinate1.y > coordinate2.y)
}
