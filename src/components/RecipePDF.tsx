
interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  difficulty: string;
  servings: number;
  tips?: string[];
  nutrition?: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
}

interface RecipePDFProps {
  recipe: Recipe | null;
  id?: string;
}

export default function RecipePDF({ recipe, id = "recipe-pdf-container" }: RecipePDFProps) {
  if (!recipe) return null;

  return (
    <div 
        id={id} 
        style={{ 
            position: 'absolute', 
            left: '-9999px',
            top: 0,
            width: '794px',
            padding: '40px',
            background: '#FFFFFF', 
            color: '#1a1a1a', 
            fontFamily: 'Inter, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box'
        }}
    >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '3px solid #ff9f1c', paddingBottom: '20px' }}>
            <h1 style={{ color: '#ff9f1c', margin: 0, fontSize: '28px' }}>Sabores Universitarios</h1>
            <p style={{ margin: '5px 0 0', opacity: 0.7, color: '#ffbf69' }}>Receta Individual</p>
        </div>

        {/* Recipe Title & Meta */}
        <div style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '32px', margin: '10px 0', color: '#ff9f1c' }}>{recipe.title}</h2>
                <div style={{ display: 'flex', gap: '20px', color: '#555', fontSize: '16px' }}>
                <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>⏱️ {recipe.prepTime} min</span>
                <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>👥 {recipe.servings} porciones</span>
                <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>📊 {recipe.difficulty}</span>
                </div>
        </div>

        {/* Description */}
        <p style={{ fontStyle: 'italic', color: '#444', lineHeight: '1.5', marginBottom: '30px', background: '#cbf3f0', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #2ec4b6' }}>
            {recipe.description}
        </p>

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '30px' }}>
            {/* Ingredients */}
            <div>
                <h3 style={{ borderBottom: '2px solid #2ec4b6', paddingBottom: '10px', color: '#2ec4b6' }}>Ingredientes</h3>
                <ul style={{ paddingLeft: '20px', marginTop: '15px', lineHeight: '1.6' }}>
                    {recipe.ingredients.map((ing, i) => (
                        <li key={i} style={{ marginBottom: '5px' }}>{ing}</li>
                    ))}
                </ul>
            </div>

            {/* Nutrition */}
            <div>
                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ borderBottom: '2px solid #2ec4b6', paddingBottom: '10px', color: '#2ec4b6' }}>Nutrición (por porción)</h3>
                    {recipe.nutrition ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
                            <div style={{ background: '#cbf3f0', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2ec4b6' }}>{recipe.nutrition.protein}</div>
                                <div style={{ fontSize: '12px', opacity: 0.8 }}>Proteína</div>
                            </div>
                            <div style={{ background: '#cbf3f0', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2ec4b6' }}>{recipe.nutrition.carbs}</div>
                                <div style={{ fontSize: '12px', opacity: 0.8 }}>Carbs</div>
                            </div>
                            <div style={{ background: '#cbf3f0', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2ec4b6' }}>{recipe.nutrition?.fat || 'N/A'}</div>
                                <div style={{ fontSize: '12px', opacity: 0.8 }}>Grasas</div>
                            </div>
                            <div style={{ background: '#cbf3f0', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2ec4b6' }}>{recipe.nutrition?.calories || 'N/A'}</div>
                                <div style={{ fontSize: '12px', opacity: 0.8 }}>Calorías</div>
                            </div>
                        </div>
                    ) : <p style={{ opacity: 0.5 }}>Información no disponible.</p>}
                </div>
            </div>
        </div>

        {/* Instructions - Full width at bottom */}
        <div style={{ flex: 1 }}>
            <h3 style={{ borderBottom: '2px solid #2ec4b6', paddingBottom: '10px', color: '#2ec4b6' }}>Instrucciones</h3>
            <ol style={{ paddingLeft: '20px', marginTop: '15px', lineHeight: '1.6' }}>
                {recipe.instructions.map((inst, i) => (
                    <li key={i} style={{ marginBottom: '10px' }}>{inst}</li>
                ))}
            </ol>
        </div>
        
            {recipe.tips && recipe.tips.length > 0 && (
            <div style={{ marginTop: '30px' }}>
                <h3 style={{ borderBottom: '2px solid #ff9f1c', paddingBottom: '10px', color: '#ff9f1c' }}>Chef Tips</h3>
                <ul style={{ paddingLeft: '20px', marginTop: '15px', fontSize: '14px', fontStyle: 'italic', color: '#555' }}>
                    {recipe.tips.map((tip, i) => (
                        <li key={i} style={{ marginBottom: '5px' }}>{tip}</li>
                    ))}
                </ul>
            </div>
        )}
    </div>
  );
}
