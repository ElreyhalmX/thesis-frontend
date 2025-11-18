export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (remainingMinutes === 0) {
    return `${hours}h`
  }
  
  return `${hours}h ${remainingMinutes}min`
}

export function formatServings(servings: number): string {
  return servings === 1 ? '1 porción' : `${servings} porciones`
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'fácil':
      return 'var(--color-success)'
    case 'intermedio':
      return 'var(--color-accent)'
    case 'avanzado':
      return 'var(--color-error)'
    default:
      return 'var(--color-foreground)'
  }
}
