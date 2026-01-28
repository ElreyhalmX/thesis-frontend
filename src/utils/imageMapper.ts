// Utility to map recipe titles to real Unsplash images based on keywords
// This ensures "Real Real" images (Photography) instead of AI generation

const IMAGE_CATEGORIES: Record<string, string[]> = {
  arepa: [
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=800&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1590403867660-8025287fb683?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1588555850935-86a0b721869e?q=80&w=800&auto=format&fit=crop"
  ],
  empanada: [
    "https://images.unsplash.com/photo-1616053805852-c322b7dc0090?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop"
  ],
  arroz: [
    "https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?q=80&w=800&auto=format&fit=crop", // Rice
    "https://images.unsplash.com/photo-1536304993881-ff00228b4db8?q=80&w=800&auto=format&fit=crop" // Chicken rice
  ],
  pasta: [
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop", // Pasta
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800&auto=format&fit=crop"
  ],
  sopa: [
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop", // Soup 1
    "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop"  // Soup 2
  ],
  carne: [
    "https://images.unsplash.com/photo-1603048297172-c92544798d5e?q=80&w=800&auto=format&fit=crop", // Meat
    "https://images.unsplash.com/photo-1544025162-d76690b67f61?q=80&w=800&auto=format&fit=crop"
  ],
  pollo: [
    "https://images.unsplash.com/photo-1587593810167-a84920ea0781?q=80&w=800&auto=format&fit=crop", // Chicken
    "https://images.unsplash.com/photo-1610057099443-fde8c4d29f10?q=80&w=800&auto=format&fit=crop"
  ],
  huevo: [
    "https://images.unsplash.com/photo-1563583271-46dae1b2111d?q=80&w=800&auto=format&fit=crop", // Scrambled high quality
    "https://images.unsplash.com/photo-1506917728037-b6af011561e2?q=80&w=800&auto=format&fit=crop"
  ],
  default: [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop", // Good overhead shot
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop", // Table full of food
    "https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=800&auto=format&fit=crop"  // Morning food
  ]
};

export function getRecipeImage(title: string, id: string): string {
  const lowerTitle = title.toLowerCase();
  
  // Deterministic selection based on ID to always get same image for same recipe
  const getDeterministic = (arr: string[]) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return arr[Math.abs(hash) % arr.length];
  };

  // Keyword matching - Priority order
  if (lowerTitle.includes("arepa")) return getDeterministic(IMAGE_CATEGORIES.arepa);
  if (lowerTitle.includes("empana")) return getDeterministic(IMAGE_CATEGORIES.empanada);
  if (lowerTitle.includes("arroz") || lowerTitle.includes("risotto")) return getDeterministic(IMAGE_CATEGORIES.arroz);
  if (lowerTitle.includes("pasta") || lowerTitle.includes("espagueti") || lowerTitle.includes("tallarines")) return getDeterministic(IMAGE_CATEGORIES.pasta);
  if (lowerTitle.includes("sopa") || lowerTitle.includes("caldo") || lowerTitle.includes("crema") || lowerTitle.includes("sancocho")) return getDeterministic(IMAGE_CATEGORIES.sopa);
  if (lowerTitle.includes("carne") || lowerTitle.includes("mechada") || lowerTitle.includes("bistec")) return getDeterministic(IMAGE_CATEGORIES.carne);
  if (lowerTitle.includes("pollo") || lowerTitle.includes("galina")) return getDeterministic(IMAGE_CATEGORIES.pollo);
  if (lowerTitle.includes("huevo") || lowerTitle.includes("perico") || lowerTitle.includes("tortilla")) return getDeterministic(IMAGE_CATEGORIES.huevo);

  // Fallback
  return getDeterministic(IMAGE_CATEGORIES.default);
}
