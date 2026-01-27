
import { useAtom } from 'jotai';
import { ArrowLeft, Save, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';
import { userProfileAtom } from '../store/atoms';
import styles from './Profile.module.scss';

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useAtom(userProfileAtom);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setProfile({ ...profile }); // Trigger storage update
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <PageTransition>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Volver al Inicio
        </button>

        <header className={styles.header}>
          <div className={styles.iconWrapper}>
            <User size={32} />
          </div>
          <h1>Perfil Nutricional</h1>
          <p>Personaliza tu experiencia y optimiza tus recomendaciones.</p>
        </header>

        <div className={styles.formContainer}>
          <div className={styles.formGroup}>
            <label>Nombre</label>
            <input 
              type="text" 
              value={profile.name} 
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              placeholder="Tu nombre"
            />
          </div>



          <div className={styles.formGroup}>
            <label>Meta Nutricional</label>
            <select 
              value={profile.nutritionalGoal} 
              onChange={(e) => setProfile({...profile, nutritionalGoal: e.target.value as any})}
            >
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Pérdida de Peso">Pérdida de Peso</option>
              <option value="Ganancia Muscular">Ganancia Muscular</option>
            </select>
          </div>

           <div className={styles.formGroup}>
            <label>Restricciones (Separadas por coma)</label>
            <input 
              type="text" 
              value={profile.dietaryRestrictions.join(", ")} 
              onChange={(e) => setProfile({...profile, dietaryRestrictions: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})}
              placeholder="Ej: Gluten, Lactosa, Maní"
            />
          </div>

          <Button onClick={handleSave} className={styles.saveButton} disabled={isSaved}>
            {isSaved ? <span style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>¡Guardado! <Save size={18}/></span> : 'Guardar Cambios'}
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
