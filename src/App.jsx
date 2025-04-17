import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const App = () => {
  const [articles, setArticles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState(false);

  // Initialiser les articles au chargement
  useEffect(() => {
    setArticles(initialArticles);
  }, []);

  const handleAdd = () => {
    setShowForm(true);
    setViewMode(false);
    setIsEditing(false);
    setCurrentArticle({ id: null, title: '', briefDescription: '', detailedDescription: '' });
  };

  const handleEdit = (article) => {
    setShowForm(true);
    setViewMode(false);
    setIsEditing(true);
    setCurrentArticle(article);
  };

  const handleSave = (article) => {
    if (isEditing) {
      const updatedArticles = articles.map(a => (a.id === article.id ? article : a));
      setArticles(updatedArticles);
      toast.success(`Article "${article.title}" modifié avec succès`);
    } else {
      const newId = articles.length > 0 ? Math.max(...articles.map(a => a.id)) + 1 : 1;
      const newArticle = { ...article, id: newId };
      setArticles([...articles, newArticle]);
      toast.success(`Nouvel article "${article.title}" ajouté avec succès`);
    }
    setShowForm(false);
  };

  const handleDelete = (id) => {
    const articleToDelete = articles.find(article => article.id === id);
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'article "${articleToDelete.title}" ?`)) {
      const updatedArticles = articles.filter(article => article.id !== id);
      setArticles(updatedArticles);
      toast.error(`Article "${articleToDelete.title}" supprimé`);
      if (currentArticle && currentArticle.id === id) {
        setCurrentArticle(null);
        setViewMode(false);
      }
    }
  };

  const handleView = (article) => {
    setCurrentArticle(article);
    setViewMode(true);
    setShowForm(false);
  };

  const handleBack = () => {
    setCurrentArticle(null);
    setViewMode(false);
  };

  return (
    <div className="app-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      <header className="app-header">
        <h1>Gestion des Articles</h1>
        {!showForm && !viewMode && (
          <button className="btn btn-add" onClick={handleAdd}>
            <i className="fas fa-plus"></i> Ajouter un article
          </button>
        )}
      </header>

      <main className="app-main">
        {!showForm && !viewMode ? (
          <div className="article-grid">
            {articles.length > 0 ? (
              articles.map(article => (
                <div key={article.id} className="article-card">
                  <h2 className="article-title">{article.title}</h2>
                  <p className="article-brief">{article.briefDescription}</p>
                  <div className="article-actions">
                    <button className="btn btn-view" onClick={() => handleView(article)}>
                      <i className="fas fa-eye"></i> Voir
                    </button>
                    <button className="btn btn-edit" onClick={() => handleEdit(article)}>
                      <i className="fas fa-edit"></i> Modifier
                    </button>
                    <button className="btn btn-delete" onClick={() => handleDelete(article.id)}>
                      <i className="fas fa-trash"></i> Supprimer
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-articles">
                <p>Aucun article disponible. Cliquez sur "Ajouter un article" pour commencer.</p>
              </div>
            )}
          </div>
        ) : viewMode ? (
          <div className="article-detail-view">
            <h2 className="detail-title">{currentArticle.title}</h2>
            <div className="detail-brief">
              <strong>Résumé:</strong> {currentArticle.briefDescription}
            </div>
            <div className="detail-content">
              <strong>Description complète:</strong>
              <p>{currentArticle.detailedDescription}</p>
            </div>
            <div className="detail-actions">
              <button className="btn btn-back" onClick={handleBack}>
                <i className="fas fa-arrow-left"></i> Retour
              </button>
              <button className="btn btn-edit" onClick={() => handleEdit(currentArticle)}>
                <i className="fas fa-edit"></i> Modifier
              </button>
            </div>
          </div>
        ) : (
          <ArticleForm
            article={currentArticle}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
            isEditing={isEditing}
          />
        )}
      </main>
    </div>
  );
};

const ArticleForm = ({ article, onSave, onCancel, isEditing }) => {
  const [title, setTitle] = useState(article.title);
  const [briefDescription, setBriefDescription] = useState(article.briefDescription);
  const [detailedDescription, setDetailedDescription] = useState(article.detailedDescription);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Le titre est obligatoire";
    if (!briefDescription.trim()) newErrors.briefDescription = "La description brève est obligatoire";
    if (!detailedDescription.trim()) newErrors.detailedDescription = "La description complète est obligatoire";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({ ...article, title, briefDescription, detailedDescription });
    }
  };

  return (
    <div className="article-form-container">
      <h2>{isEditing ? "Modifier l'article" : "Ajouter un nouvel article"}</h2>
      <form onSubmit={handleSubmit} className="article-form">
        <div className="form-group">
          <label htmlFor="title">Titre</label>
          <input 
            id="title"
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className={errors.title ? "input-error" : ""}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="briefDescription">Description Brève</label>
          <input 
            id="briefDescription"
            type="text" 
            value={briefDescription} 
            onChange={(e) => setBriefDescription(e.target.value)}
            className={errors.briefDescription ? "input-error" : ""}
          />
          {errors.briefDescription && <span className="error-message">{errors.briefDescription}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="detailedDescription">Description Complète</label>
          <textarea 
            id="detailedDescription"
            value={detailedDescription} 
            onChange={(e) => setDetailedDescription(e.target.value)}
            rows="6"
            className={errors.detailedDescription ? "input-error" : ""}
          ></textarea>
          {errors.detailedDescription && <span className="error-message">{errors.detailedDescription}</span>}
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-save">
            <i className="fas fa-save"></i> Enregistrer
          </button>
          <button type="button" className="btn btn-cancel" onClick={onCancel}>
            <i className="fas fa-times"></i> Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

// Données initiales
const initialArticles = [
  {
    id: 1,
    title: 'EcoBreeze Air Purifier',
    briefDescription: "Purificateur d'air écologique et silencieux pour une maison saine.",
    detailedDescription: "L'EcoBreeze Air Purifier utilise une technologie de filtration à quatre niveaux pour éliminer les polluants, allergènes et particules fines de l'air. Équipé d'un capteur intelligent, il ajuste automatiquement la puissance de filtration en fonction de la qualité de l'air. Son design compact et élégant s'intègre parfaitement dans n'importe quelle pièce, offrant une purification efficace sans nuire à l'esthétique de votre intérieur. Avec une consommation énergétique minimale, il est parfait pour les foyers soucieux de l'environnement."
  },
  {
    id: 2,
    title: 'LuminaTouch Smart Lamp',
    briefDescription: "Lampe intelligente avec contrôle tactile et éclairage ajustable.",
    detailedDescription: "La LuminaTouch Smart Lamp est plus qu'une simple lampe de bureau. Elle offre une variété de modes d'éclairage pour s'adapter à toutes vos activités, que ce soit la lecture, le travail ou la détente. Son panneau de contrôle tactile intuitif vous permet de régler facilement la luminosité et la température de couleur. La lampe est également équipée d'un port de chargement USB pour vos appareils mobiles et d'une fonction de minuterie pour s'éteindre automatiquement après une certaine période. Son design élégant et moderne s'intègre parfaitement dans tout intérieur."
  },
  {
    id: 3,
    title: 'SonoMax Bluetooth Speaker',
    briefDescription: "Enceinte portable avec son immersif et autonomie exceptionnelle.",
    detailedDescription: "L'enceinte SonoMax offre une expérience audio exceptionnelle grâce à ses haut-parleurs de haute qualité et sa technologie de son surround virtuel. Avec une autonomie de 20 heures, elle vous accompagne toute la journée sans nécessiter de recharge. Sa conception résistante à l'eau (IPX7) vous permet de l'utiliser près de la piscine ou à la plage sans souci. La connectivité Bluetooth 5.0 assure une connexion stable jusqu'à 30 mètres de distance. Son design élégant et ses commandes intuitives en font l'accessoire parfait pour tous vos moments musicaux."
  },
  {
    id: 4,
    title: 'FitTrack Smart Scale',
    briefDescription: "Balance connectée mesurant plus de 17 indicateurs de santé corporelle.",
    detailedDescription: "La FitTrack Smart Scale va bien au-delà d'une simple mesure de poids. Elle analyse votre composition corporelle complète, incluant le pourcentage de graisse, la masse musculaire, la densité osseuse, l'hydratation et bien plus encore. Connectée à l'application mobile FitTrack, elle vous permet de suivre vos progrès au fil du temps avec des graphiques détaillés et des conseils personnalisés. Compatible avec jusqu'à 8 profils différents, c'est l'outil idéal pour toute la famille souhaitant suivre sa santé de manière précise et scientifique."
  }
];

export default App;
