
import React, { useState, useEffect, useCallback } from 'react';
import { SurveyEntry } from './types';

// Components
const InputField = ({ label, name, value, onChange, type = "text", placeholder = "", readOnly = false }: any) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${readOnly ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
    />
  </div>
);

const RadioGroup = ({ label, name, options, value, onChange }: any) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
    <div className="flex flex-wrap gap-3">
      {options.map((opt: any) => (
        <label key={opt.value} className="flex items-center space-x-2 bg-white border border-slate-200 px-4 py-2 rounded-full cursor-pointer hover:bg-slate-50 transition-colors">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={onChange}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <span className="text-sm text-slate-600">{opt.label}</span>
        </label>
      ))}
    </div>
  </div>
);

const initialFormState: SurveyEntry = {
  id: '',
  timestamp: '',
  latitude: '',
  longitude: '',
  date_enquete: '',
  region: '',
  departement: '',
  arrondissement: '',
  village: '',
  is_pecheur: '',
  is_marineur: '',
  nom_prenom: '',
  telephone: '',
  num_enregistrement: '',
  tranche_age: '',
  age: '',
  sexe: '',
  situation_matrimoniale: '',
  enfants_charge: '',
  niveau_etude: '',
  religion: '',
  region_origine: '',
  activite_principale: '',
  activite_principale_autre: '',
  activite_secondaire: '',
  activite_secondaire_autre: '',
  experience: '',
  motif_activite: '',
  motif_activite_autre: '',
  distinguer_machoiron: '',
  nb_especes_pechees: '',
  distinction_methode: '',
  nom_local_existe: '',
  noms_locaux: '',
  nom_maternelle_A: '',
  nom_maternelle_B: '',
  nom_maternelle_C: '',
  espece_plus_pechee: '',
  espece_preferee: '',
  espece_plus_grande: '',
  poids_max_A: '',
  poids_max_B: '',
  poids_max_C: '',
  annee_max_A: '',
  annee_max_B: '',
  annee_max_C: '',
  poids_max_2025_A: '',
  poids_max_2025_B: '',
  poids_max_2025_C: '',
  taille_min_2025_A: '',
  taille_min_2025_B: '',
  taille_min_2025_C: '',
  evolution_quantite_A: '',
  evolution_quantite_B: '',
  evolution_quantite_C: '',
  periode_abondante_A: '',
  periode_abondante_B: '',
  periode_abondante_C: '',
  lieu_peche_A: '',
  lieu_peche_B: '',
  lieu_peche_C: '',
  difficultes_capture: '',
  engins_A: '',
  engins_B: '',
  engins_C: '',
  engin_adapte_A: '',
  engin_adapte_B: '',
  engin_adapte_C: '',
  acheteurs_A: '',
  acheteurs_B: '',
  acheteurs_C: '',
  lieu_achat: '',
  lieu_achat_autre: '',
  motif_achat: '',
  quantites_max: '',
  quantites_max_oui: '',
  poids_prise_petit: '',
  poids_prise_gros: '',
  etat_vente_A: '',
  etat_vente_B: '',
  etat_vente_C: '',
  methode_mesure_A: '',
  methode_mesure_B: '',
  methode_mesure_C: '',
  periode_prix_eleve: '',
  raison_periode_prix_eleve: '',
  prix_periode_A: '',
  prix_periode_B: '',
  prix_periode_C: '',
  prix_max_saison_A: '',
  prix_max_saison_B: '',
  prix_max_saison_C: '',
  difficultes_vente: '',
};

export default function App() {
  const [formData, setFormData] = useState<SurveyEntry>(initialFormState);
  const [submissions, setSubmissions] = useState<SurveyEntry[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'searching' | 'fixed' | 'denied'>('searching');

  const updateLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      setGpsStatus('searching');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          setGpsStatus('fixed');
        },
        (error) => {
          console.error("GPS Error:", error);
          setGpsStatus('denied');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setGpsStatus('denied');
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('sanaga_submissions');
    if (saved) setSubmissions(JSON.parse(saved));

    const draft = localStorage.getItem('sanaga_draft');
    if (draft) setFormData(JSON.parse(draft));

    updateLocation();
  }, [updateLocation]);

  useEffect(() => {
    localStorage.setItem('sanaga_draft', JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const notify = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      ...formData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    const updatedSubmissions = [...submissions, newEntry];
    setSubmissions(updatedSubmissions);
    localStorage.setItem('sanaga_submissions', JSON.stringify(updatedSubmissions));
    
    setFormData(initialFormState);
    localStorage.removeItem('sanaga_draft');
    setCurrentSection(0);
    notify("Enquête enregistrée avec succès !", "success");
    window.scrollTo(0, 0);
    updateLocation();
  };

  const downloadCSV = () => {
    if (submissions.length === 0) {
      notify("Aucune donnée à exporter", "error");
      return;
    }

    const columnsToExclude = ['tranche_age', 'region_origine', 'nom_local_existe', 'noms_locaux'];
    const allKeys = Object.keys(submissions[0]);
    const headers = allKeys.filter(key => !columnsToExclude.includes(key)).join(',');
    
    const rows = submissions.map(entry => 
      allKeys
        .filter(key => !columnsToExclude.includes(key))
        .map(key => `"${entry[key as keyof typeof entry].toString().replace(/"/g, '""')}"`)
        .join(',')
    ).join('\n');
    
    const csvContent = `${headers}\n${rows}`;
    // Add UTF-8 BOM to ensure proper character encoding in Excel and other programs
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sanaga_survey_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify("Fichier CSV téléchargé", "success");
  };

  const clearAllData = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer toutes les données ? Cette action ne peut pas être annulée.")) {
      setSubmissions([]);
      localStorage.removeItem('sanaga_submissions');
      notify("Toutes les données ont été supprimées", "success");
    }
  };

  const sections = [
    { title: "Renseignements Généraux", id: "s1" },
    { title: "Identification Socio-Professionnelle", id: "s2" },
    { title: "Caractéristiques Biotechniques", id: "s3" },
    { title: "Socioéconomiques", id: "s4" }
  ];

  const nextSection = () => setCurrentSection(prev => Math.min(prev + 1, sections.length - 1));
  const prevSection = () => setCurrentSection(prev => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg sticky top-0 z-50 px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">ENSAHV - Enquête Sanaga</h1>
          <p className="text-xs opacity-80">Master 2 - Filière Aquaculture - Enquête Biotechnique & Socioéco</p>
        </div>
        <button 
          onClick={downloadCSV}
          className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-2 border border-white/40 backdrop-blur-sm transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          CSV ({submissions.length})
        </button>
      </header>

      {/* Progress Bar */}
      <div className="bg-blue-100 h-1 flex w-full">
        {sections.map((_, i) => (
          <div key={i} className={`flex-1 h-full transition-all duration-500 ${i <= currentSection ? 'bg-blue-600' : ''}`} />
        ))}
      </div>

      <main className="max-w-xl mx-auto px-4 pt-6">
        {/* Notification Toast */}
        {notification && (
          <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-50 text-white font-medium flex items-center gap-2 animate-bounce ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            <span>{notification.message}</span>
          </div>
        )}

        <div className="flex justify-end gap-3 mb-4">
          <button
            onClick={clearAllData}
            disabled={submissions.length === 0}
            className={`px-3 py-2 rounded-md font-semibold transition-all ${submissions.length === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
          >
            Effacer les données
          </button>
          <button
            onClick={downloadCSV}
            disabled={submissions.length === 0}
            className={`px-3 py-2 rounded-md font-semibold transition-all ${submissions.length === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            Exportez les données ({submissions.length})
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-8">
          <h2 className="text-blue-600 font-bold uppercase tracking-wider text-xs mb-1">SECTION {currentSection + 1}</h2>
          <h3 className="text-2xl font-bold text-slate-800 mb-6">{sections[currentSection].title}</h3>

          <form onSubmit={handleSubmit}>
            {/* SECTION 01: RENSEIGNEMENTS GENERAUX */}
            {currentSection === 0 && (
              <div className="animate-in fade-in duration-500">
                <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Coordonnées GPS</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      gpsStatus === 'fixed' ? 'bg-green-100 text-green-700' : 
                      gpsStatus === 'searching' ? 'bg-yellow-100 text-yellow-700 animate-pulse' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {gpsStatus === 'fixed' ? 'Signal OK' : gpsStatus === 'searching' ? 'Recherche...' : 'Erreur GPS'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Latitude" name="latitude" value={formData.latitude} readOnly placeholder="Attente signal..." />
                    <InputField label="Longitude" name="longitude" value={formData.longitude} readOnly placeholder="Attente signal..." />
                  </div>
                  <button 
                    type="button" 
                    onClick={updateLocation}
                    className="w-full text-xs text-blue-600 font-semibold py-1 hover:underline"
                  >
                    Actualiser la position
                  </button>
                </div>

                <InputField label="Date d'enquête" name="date_enquete" type="date" placeholder="jj/mm/aaaa" value={formData.date_enquete} onChange={handleInputChange} />
                {/* <InputField label="Région" name="region" value={formData.region} onChange={handleInputChange} /> */}
                <RadioGroup label="Région" name="region" options={[{label: 'Centre', value: 'Centre'}, {label: 'Ouest', value: 'Ouest'} 
                  , {label: 'Est', value: 'Est'}, , {label: 'Sud', value: 'Sud'}, {label: 'Nord-Ouest', value: 'Nord_Ouest'}
                  , {label: 'Littoral', value: 'Littoral'}, {label: 'Sud-Ouest', value: 'Sud_Ouest'}
                  , {label: 'Adamaoua', value: 'Adamaoua'}, {label: 'Nord', value: 'Nord'}
                  , {label: 'Extrême-Nord', value: 'Extreme_Nord'}]} value={formData.region} onChange={handleInputChange} />

                <InputField label="Département" name="departement" placeholder="Ex: Mfoundi, Nkam, Wouri ..." value={formData.departement} onChange={handleInputChange} />
                <InputField label="Arrondissement" name="arrondissement" placeholder="Ex: Menoua, Haut-Nkam ..." value={formData.arrondissement} onChange={handleInputChange} />
                <InputField label="Village" name="village" placeholder="Ex: Nkol-Yegue ..." value={formData.village} onChange={handleInputChange} />
                <div className="grid grid-cols-2 gap-4">
                  <RadioGroup label="Etes-vous un pêcheur ?" name="is_pecheur" options={[{label: 'Oui', value: 'Oui'}, {label: 'Non', value: 'Non'}]} value={formData.is_pecheur} onChange={handleInputChange} />
                  <RadioGroup label="Etes-vous un Marineur ?" name="is_marineur" options={[{label: 'Oui', value: 'Oui'}, {label: 'Non', value: 'Non'}]} value={formData.is_marineur} onChange={handleInputChange} />
                </div>
                <InputField label="Nom et Prénom" name="nom_prenom" placeholder="Ex: KOMBE François" value={formData.nom_prenom} onChange={handleInputChange} />
                <InputField label="Numéro de téléphone" name="telephone" type="tel" placeholder="Ex: 6 xx xx xx xx" value={formData.telephone} onChange={handleInputChange} />
                <InputField label="Numéro d'enregistrement" name="num_enregistrement" value={formData.num_enregistrement} onChange={handleInputChange} />
              </div>
            )}

            {/* SECTION 02: IDENTIFICATION SOCIO-PROFESSIONNELLE */}
            {currentSection === 1 && (
              <div className="animate-in slide-in-from-right duration-500">
                {/* <RadioGroup label="Tranche d'âge" name="tranche_age" options={[{label:'18-25', value:'18-25'},{label:'26-32', value:'26-32'},{label:'33-40', value:'33-40'},{label:'41-57', value:'41-57'},{label:'58+', value:'58+'}]} value={formData.tranche_age} onChange={handleInputChange} /> */}
                <InputField label="Quel est votre âge ?" name="age" value={formData.age} onChange={handleInputChange} />

                <RadioGroup label="Sexe" name="sexe" options={[{label:'Masculin', value:'M'},{label:'Féminin', value:'F'}]} value={formData.sexe} onChange={handleInputChange} />
                <RadioGroup label="Situation matrimoniale" name="situation_matrimoniale" options={[{label:'Marié', value:'Marie'},{label:'Célibataire', value:'Celibataire'},{label:'Veuf(ve)', value:'Veuf'},{label:'Divorcé', value:'Divorce'}]} value={formData.situation_matrimoniale} onChange={handleInputChange} />
                <RadioGroup label="Nombre d'enfants à charge" name="enfants_charge" options={[{label:'Aucun', value:'Aucun'},{label:'1-2', value:'1-2'},{label:'3-5', value:'3-5'},{label:'plus de 5', value:'5+'}]} value={formData.enfants_charge} onChange={handleInputChange} />
                <RadioGroup label="Niveau d'étude" name="niveau_etude" options={[{label:'Jamais été à l\'école', value:'Aucun'},{label:'Primaire', value:'Primaire'},{label:'Secondaire', value:'Secondaire'},{label:'Supérieur', value:'Superieur'}]} value={formData.niveau_etude} onChange={handleInputChange} />
                <RadioGroup label="Réligion" name="religion" options={[{label:'Chrétien', value:'Chretien'},{label:'Musulman', value:'Musulman'},{label:'Animiste', value:'Animiste'}]} value={formData.religion} onChange={handleInputChange} />
                {/* <InputField label="Région d'origine" name="region_origine" value={formData.region_origine} onChange={handleInputChange} /> */}
                
                <RadioGroup 
                  label="Activité principale" 
                  name="activite_principale" 
                  options={[
                    {label:'Pêcheur', value:'Pecheur'},
                    {label:'Revendeur', value:'Revendeur'},
                    {label:'Transformateur', value:'Transformateur'},
                    {label:'Fonctionnaire', value:'Fonctionnaire'},
                    {label:'Autre', value:'Autre'}
                  ]} 
                  value={formData.activite_principale} 
                  onChange={handleInputChange} 
                />

                {/* Conditional Text Box for "Autre" */}
                {formData.activite_principale === 'Autre' && (
                  <div className="animate-in slide-in-from-top duration-300">
                    <InputField 
                      label="Précisez l'activité principale" 
                      name="activite_principale_autre" 
                      value={formData.activite_principale_autre} 
                      onChange={handleInputChange} 
                      placeholder="Ex: Agriculteur, Transporteur..."
                    />
                  </div>
                )}

                <RadioGroup 
                  label="Activité secondaire" 
                  name="activite_secondaire" 
                  options={[
                    {label:'Pêcheur', value:'Pecheur'},
                    {label:'Revendeur', value:'Revendeur'},
                    {label:'Transformateur', value:'Transformateur'},
                    {label:'Fonctionnaire', value:'Fonctionnaire'},
                    {label:'Autre', value:'Autre'}
                  ]} 
                  value={formData.activite_secondaire} 
                  onChange={handleInputChange} 
                />

                {/* Conditional Text Box for "Autre" */}
                {formData.activite_secondaire === 'Autre' && (
                  <div className="animate-in slide-in-from-top duration-300">
                    <InputField 
                      label="Précisez l'activité secondaire" 
                      name="activite_secondaire_autre" 
                      value={formData.activite_secondaire_autre} 
                      onChange={handleInputChange} 
                      placeholder="Ex: Agriculteur, Transporteur..."
                    />
                  </div>
                )}

                <RadioGroup label="Année d'expérience" name="experience" options={[{label:'< 1', value:'<1'}
                  ,{label:'1-5', value:'1-5'},{label:'6-10', value:'6-10'},{label:'11-20', value:'11-20'},{label:'> 20', value:'>20'}]} value={formData.experience} onChange={handleInputChange} />

                <RadioGroup 
                  label="Pourqoui exercez-vous cette activité ?" 
                  name="motif_activite" 
                  options={[
                    {label:'Autoconsommation', value:'Autoconsommation'},
                    {label:'Générateur de revenue', value:'generateur_revenue'},
                    {label:'Loisir', value:'Loisir'},
                    {label:'Faire des dons', value:'dons'},
                    {label:'Autre', value:'Autre'}
                  ]} 
                  value={formData.motif_activite} 
                  onChange={handleInputChange} 
                />

                {/* Conditional Text Box for "Autre" */}
                {formData.motif_activite === 'Autre' && (
                  <div className="animate-in slide-in-from-top duration-300">
                    <InputField 
                      label="Précisez la raison" 
                      name="motif_activite_autre" 
                      value={formData.motif_activite_autre} 
                      onChange={handleInputChange} 
                      placeholder="Ex: ..."
                    />
                  </div>
                )}

              </div>
            )}

            {/* SECTION 03: CARACTERISTIQUES BIOTECHNIQUES */}
            {currentSection === 2 && (
              <div className="animate-in slide-in-from-right duration-500 space-y-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <RadioGroup label="Pouvez-vous distinguer le machoiron des autres espèces ?" name="distinguer_machoiron" options={[{label:'Oui', value:'Oui'},{label:'Non', value:'Non'}]} value={formData.distinguer_machoiron} onChange={handleInputChange} />
                  <InputField label="Combien d'espèces de mochoirons sont géneralement péchées ?" name="nb_especes_pechees" placeholder="Ex: 3" value={formData.nb_especes_pechees} onChange={handleInputChange} />
                  <InputField label="Comment distinguez-vous ces espèces ?" name="distinction_methode" placeholder="Ex: Taille, couleur, forme, signe distinctif, ..." value={formData.distinction_methode} onChange={handleInputChange} />
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-700 border-b pb-2">Ces espèces, ont-elles un Nom en langue maternelle ?</h4>
                  <InputField label="" name="nom_maternelle_A" placeholder="Nom Espèce A" value={formData.nom_maternelle_A} onChange={handleInputChange} />
                  <InputField label="" name="nom_maternelle_B" placeholder="Nom Espèce B" value={formData.nom_maternelle_B} onChange={handleInputChange} />
                  <InputField label="" name="nom_maternelle_C" placeholder="Nom Espèce C" value={formData.nom_maternelle_C} onChange={handleInputChange} />                   
                  <RadioGroup label="Quelle est l'espèce la plus péchée ?" name="espece_plus_pechee" options={[{label:'A', value:'A'},{label:'B', value:'B'},{label:'C', value:'C'} ]} value={formData.espece_plus_pechee} onChange={handleInputChange} />
                  <RadioGroup label="quelle est l'espèce préférée ?" name="espece_preferee" options={[{label:'A', value:'A'},{label:'B', value:'B'},{label:'C', value:'C'} ]} value={formData.espece_preferee} onChange={handleInputChange} />
                  <RadioGroup label="Quelle est l'espèce qui présente les plus grandes tailles ?" name="espece_plus_grande" options={[{label:'A', value:'A'},{label:'B', value:'B'},{label:'C', value:'C'} ]} value={formData.espece_plus_grande} onChange={handleInputChange} />

                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-slate-700 border-b pb-2">Quel est le poids le plus élevé déjà capturé (ex: 10kg)</h4>
                  <InputField label="" name="poids_max_A" placeholder="Espèce A " value={formData.poids_max_A} onChange={handleInputChange} />
                  <InputField label="" name="poids_max_B" placeholder="Espèce B" value={formData.poids_max_B} onChange={handleInputChange} />
                  <InputField label="" name="poids_max_C" placeholder="Espèce C" value={formData.poids_max_C} onChange={handleInputChange} />
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-slate-700 border-b pb-2">En quelle année ? (ex: 2010, 2020)</h4>
                  <InputField label="" name="annee_max_A" placeholder="Espèce A " value={formData.annee_max_A} onChange={handleInputChange} />
                  <InputField label="" name="annee_max_B" placeholder="Espèce B" value={formData.annee_max_B} onChange={handleInputChange} />
                  <InputField label="" name="annee_max_C" placeholder="Espèce C" value={formData.annee_max_C} onChange={handleInputChange} />
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-slate-700 border-b pb-2">Quel est le poids le plus élevé péché en 2025 (ex: 10kg, 20kg)</h4>
                  <InputField label="" name="poids_max_2025_A" placeholder="Espèce A " value={formData.poids_max_2025_A} onChange={handleInputChange} />
                  <InputField label="" name="poids_max_2025_B" placeholder="Espèce B" value={formData.poids_max_2025_B} onChange={handleInputChange} />
                  <InputField label="" name="poids_max_2025_C" placeholder="Espèce C" value={formData.poids_max_2025_C} onChange={handleInputChange} />
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-slate-700 border-b pb-2">Quel est la plus petite taille pêchée en 2025 ?(ex: 500g, 1kg)  </h4>
                  <InputField label="" name="taille_min_2025_A" placeholder="Espèce A " value={formData.taille_min_2025_A} onChange={handleInputChange} />
                  <InputField label="" name="taille_min_2025_B" placeholder="Espèce B" value={formData.taille_min_2025_B} onChange={handleInputChange} />
                  <InputField label="" name="taille_min_2025_C" placeholder="Espèce C" value={formData.taille_min_2025_C} onChange={handleInputChange} />
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-700 border-b pb-2">Comment évolue les quantités pêchées ?</h4>
                  <RadioGroup label="Espèce A" name="evolution_quantite_A" options={[{label:'Diminue', value:'Diminue'}
                  ,{label:'Stable', value:'Stable'},{label:'Augmente', value:'Augmente'},{label:'Je ne sais pas', value:'ne_sais_pas'} ]} value={formData.evolution_quantite_A} onChange={handleInputChange} />
                  <RadioGroup label="Espèce B" name="evolution_quantite_B" options={[{label:'Diminue', value:'Diminue'}
                  ,{label:'Stable', value:'Stable'},{label:'Augmente', value:'Augmente'},{label:'Je ne sais pas', value:'ne_sais_pas'} ]} value={formData.evolution_quantite_B} onChange={handleInputChange} />
                  <RadioGroup label="Espèce C" name="evolution_quantite_C" options={[{label:'Diminue', value:'Diminue'}
                  ,{label:'Stable', value:'Stable'},{label:'Augmente', value:'Augmente'},{label:'Je ne sais pas', value:'ne_sais_pas'} ]} value={formData.evolution_quantite_C} onChange={handleInputChange} />
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-700 border-b pb-2">Quelle est la période de pêche abondante ?</h4>
                  <RadioGroup label="Espèce A" name="periode_abondante_A" options={[{label:'Saison Pluvieuse', value:'saison_pluvieuse'}
                  ,{label:'Saison sèche', value:'saison_seche'},{label:'Le jour', value:'jour'},{label:'La nuit', value:'nuit'},{label:'Je ne sais pas', value:'ne_sais_pas'} ]} value={formData.periode_abondante_A} onChange={handleInputChange} />
                  <RadioGroup label="Espèce B" name="periode_abondante_B" options={[{label:'Saison Pluvieuse', value:'saison_pluvieuse'}
                  ,{label:'Saison sèche', value:'saison_seche'},{label:'Le jour', value:'jour'},{label:'La nuit', value:'nuit'},{label:'Je ne sais pas', value:'ne_sais_pas'} ]} value={formData.periode_abondante_B} onChange={handleInputChange} />
                  <RadioGroup label="Espèce C" name="periode_abondante_C" options={[{label:'Saison Pluvieuse', value:'saison_pluvieuse'}
                  ,{label:'Saison sèche', value:'saison_seche'},{label:'Le jour', value:'jour'},{label:'La nuit', value:'nuit'},{label:'Je ne sais pas', value:'ne_sais_pas'} ]} value={formData.periode_abondante_C} onChange={handleInputChange} />             
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-700 border-b pb-2">Où trouve t'on le plus le machoiron ?</h4>
                  <RadioGroup label="Espèce A" name="lieu_peche_A" options={[{label:'Les rapides', value:'rapides'}
                  ,{label:'Les eaux calmes', value:'eau_calme'},{label:'Les eaux profondes', value:'eau_profonde'},{label:'Je ne sais pas', value:'ne_sais_pas'} ]} value={formData.lieu_peche_A} onChange={handleInputChange} />
                  <RadioGroup label="Espèce B" name="lieu_peche_B" options={[{label:'Les rapides', value:'rapides'}
                  ,{label:'Les eaux calmes', value:'eau_calme'},{label:'Les eaux profondes', value:'eau_profonde'},{label:'Je ne sais pas', value:'ne_sais_pas'} ]} value={formData.lieu_peche_B} onChange={handleInputChange} />
                  <RadioGroup label="Espèce C" name="lieu_peche_C" options={[{label:'Les rapides', value:'rapides'}
                  ,{label:'Les eaux calmes', value:'eau_calme'},{label:'Les eaux profondes', value:'eau_profonde'},{label:'Je ne sais pas', value:'ne_sais_pas'} ]} value={formData.lieu_peche_C} onChange={handleInputChange} />
                </div>

                <InputField label="Y a t'il des difficultés liées à la capture de ces espèces ?" 
                name="difficultes_capture" placeholder="Si oui, lesquelles ?" value={formData.difficultes_capture} onChange={handleInputChange} />

                <div className="space-y-4">
                  <h4 className="font-bold text-slate-700 border-b pb-2">Quels types d'engins sont utilisés ? (ex: actifs, dormant, pièges, autre)</h4>
                  <InputField label="" name="engins_A" placeholder="Espèce A" value={formData.engins_A} onChange={handleInputChange} />
                  <InputField label="" name="engins_B" placeholder="Espèce B" value={formData.engins_B} onChange={handleInputChange} />
                  <InputField label="" name="engins_C" placeholder="Espèce C" value={formData.engins_C} onChange={handleInputChange} />
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-slate-700 border-b pb-2">Quel engin est le plus adapté ? (Senne, Epervier, filet dormant, Hameçons, Nasses, La ligne, Autres)</h4>
                  <InputField label="" name="engin_adapte_A" placeholder="Espèce A" value={formData.engin_adapte_A} onChange={handleInputChange} />
                  <InputField label="" name="engin_adapte_B" placeholder="Espèce B" value={formData.engin_adapte_B} onChange={handleInputChange} />
                  <InputField label="" name="engin_adapte_C" placeholder="Espèce C" value={formData.engin_adapte_C} onChange={handleInputChange} />
                </div>

              </div>
            )}

            {/* SECTION 04: SOCIOECONOMIQUES */}
            {currentSection === 3 && (
              <div className="animate-in slide-in-from-right duration-500 space-y-6">
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-700 border-b pb-2">Qui achète ces poissons ?</h4>
                  <InputField label="Pour A (Hôtels, Revendeurs, Ménages, HOmmes d'affaires, autre)" name="acheteurs_A" value={formData.acheteurs_A} onChange={handleInputChange} />
                  <InputField label="Pour B" name="acheteurs_B" value={formData.acheteurs_B} onChange={handleInputChange} />
                  <InputField label="Pour C" name="acheteurs_C" value={formData.acheteurs_C} onChange={handleInputChange} />
                </div>

                <RadioGroup 
                  label="Où achètent-ils ces poissons ?" 
                  name="lieu_achat" 
                  options={[
                    {label:"Au bord de l'eau", value:'bord_eau'},
                    {label:'Au marché', value:'marche'},
                    {label:'Par livraison', value:'livraison'},
                    {label:'Autre', value:'Autre'}
                  ]} 
                  value={formData.lieu_achat} 
                  onChange={handleInputChange} 
                />

                {/* Conditional Text Box for "Autre" */}
                {formData.lieu_achat === 'Autre' && (
                  <div className="animate-in slide-in-from-top duration-300">
                    <InputField 
                      label="Précisez le lieu" 
                      name="lieu_achat_autre" 
                      value={formData.lieu_achat_autre} 
                      onChange={handleInputChange} 
                      placeholder="Ex: ..."
                    />
                  </div>
                )}


                <RadioGroup 
                  label="Pour qoui achètent-ils ces poissons ?" 
                  name="motif_achat" 
                  options={[
                    {label:"Braiser", value:'Braiser'},
                    {label:'Consommer', value:'Consommer'},
                    {label:'Faire des rites', value:'rites'},
                    {label:'Autre', value:'Autre'}
                  ]} 
                  value={formData.motif_achat} 
                  onChange={handleInputChange} 
                />

                {/* Conditional Text Box for "Autre" */}
                {formData.motif_achat === 'Autre' && (
                  <div className="animate-in slide-in-from-top duration-300">
                    <InputField 
                      label="Précisez" 
                      name="motif_achat_autre" 
                      value={formData.motif_achat_autre} 
                      onChange={handleInputChange} 
                      placeholder="Ex: ..."
                    />
                  </div>
                )}

                <RadioGroup 
                  label="Les acheteurs ont-ils des quantités maximales à achéter ?" 
                  name="quantites_max" 
                  options={[
                    {label:"Oui", value:'Oui'},
                    {label:'Non', value:'Non'},
                  ]} 
                  value={formData.quantites_max} 
                  onChange={handleInputChange} 
                />

                {/* Conditional Text Box for "Autre" */}
                {formData.quantites_max === 'Oui' && (
                  <div className="animate-in slide-in-from-top duration-300">
                    <InputField 
                      label="Précisez" 
                      name="quantites_max_oui" 
                      value={formData.quantites_max_oui} 
                      onChange={handleInputChange} 
                      placeholder="Ex: 50"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <h4 className="font-bold text-slate-700 border-b pb-2">Quel est le poids prisé ?</h4>
                  <InputField label="Chez les petits poissons (ex: 200g)" name="poids_prise_petit" value={formData.poids_prise_petit} onChange={handleInputChange} />
                  <InputField label="Chez les gros poissons (ex: 2kg)" name="poids_prise_gros" value={formData.poids_prise_gros} onChange={handleInputChange} />
                </div>    

                <div className="space-y-4">
                  <h4 className="font-bold text-slate-700 border-b pb-2">Comment vendez-vous ces espèces ?</h4>               
                  <RadioGroup label="Espèce A" name="etat_vente_A" options={[{label:'Frais', value:'Frais'}
                  ,{label:'Fumé', value:'Fume'},{label:'Vivant', value:'Vivant'} ]} value={formData.etat_vente_A} onChange={handleInputChange} />
                  <RadioGroup label="Espèce A" name="etat_vente_B" options={[{label:'Frais', value:'Frais'}
                  ,{label:'Fumé', value:'Fume'},{label:'Vivant', value:'Vivant'} ]} value={formData.etat_vente_B} onChange={handleInputChange} />
                  <RadioGroup label="Espèce A" name="etat_vente_C" options={[{label:'Frais', value:'Frais'}
                  ,{label:'Fumé', value:'Fume'},{label:'Vivant', value:'Vivant'} ]} value={formData.etat_vente_C} onChange={handleInputChange} />                 
                </div>

                <div className="g-slate-50 p-4 rounded-xl border border-slate-200">
                  <InputField label="Quelle est la méthode de mesure utilisée pour les ventes (Kilogramme, Sceau, Panier, corde, autre)" name="methode_mesure_A" placeholder="Espèce A" value={formData.methode_mesure_A} onChange={handleInputChange} />
                  <InputField label="" name="methode_mesure_B" placeholder="Espèce B" value={formData.methode_mesure_B} onChange={handleInputChange} />
                  <InputField label="" name="methode_mesure_C" placeholder="Espèce C" value={formData.methode_mesure_C} onChange={handleInputChange} />
                </div>

                <InputField label="A quelle période l'année le prix est le plus élevé ?" name="periode_prix_eleve" value={formData.periode_prix_eleve} onChange={handleInputChange} />
                <InputField label="Pourqoui est-ce que le prix est élevé à cette période ?" name="raison_periode_prix_eleve" value={formData.raison_periode_prix_eleve} onChange={handleInputChange} />

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <InputField label="Quel est le prix de chacune des espèces cette période de l'année ?" name="prix_periode_A" placeholder="Espèce A ex: 1000 FCFA" value={formData.prix_periode_A} onChange={handleInputChange} />
                  <InputField label="" name="prix_periode_B" placeholder="Espèce B ex: 1000 FCFA" value={formData.prix_periode_B} onChange={handleInputChange} />
                  <InputField label="" name="prix_periode_C" placeholder="Espèce C ex: 1000 FCFA" value={formData.prix_periode_C} onChange={handleInputChange} />
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <InputField label="Prix le plus élevé quel que soit la saison ?" name="prix_max_saison_A" placeholder="Espèce A" value={formData.prix_max_saison_A} onChange={handleInputChange} />
                  <InputField label="" name="prix_max_saison_B" placeholder="Espèce B" value={formData.prix_max_saison_B} onChange={handleInputChange} />
                  <InputField label="" name="prix_max_saison_C" placeholder="Espèce C" value={formData.prix_max_saison_C} onChange={handleInputChange} />
                </div>

                <InputField label="Y a t'il des difficultés pour vendre ces poissons ?" name="difficultes_vente" value={formData.difficultes_vente} onChange={handleInputChange} />

                <div className="space-y-3 mt-6">
                  <button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
                  >
                    Enregistrer
                  </button>
                  
                  {/* <button 
                    type="button"
                    onClick={() => {
                      setFormData(initialFormState);
                      localStorage.removeItem('sanaga_draft');
                      setCurrentSection(0);
                      notify("Nouveau questionnaire prêt", "success");
                      window.scrollTo(0, 0);
                      updateLocation();
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
                  >
                    REMPLIR UN AUTRE QUESTIONNAIRE
                  </button> */}

                  {/* <button 
                    type="button"
                    onClick={downloadCSV}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Exportez les données ({submissions.length})
                  </button> */}
                </div>
              </div>
            )}
          </form>
        </div>
      </main>

      {/* Sticky Navigation Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-2xl z-40">
        <div className="max-w-xl mx-auto flex justify-between items-center gap-4">
          <button 
            onClick={prevSection}
            disabled={currentSection === 0}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold flex justify-center items-center gap-2 border border-slate-300 ${currentSection === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-50 text-slate-600 active:bg-slate-100'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            Précédent
          </button>
          
          <div className="flex-none text-slate-400 font-bold text-sm tracking-widest px-4">
            {currentSection + 1} / {sections.length}
          </div>

          <button 
            onClick={nextSection}
            disabled={currentSection === sections.length - 1}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold flex justify-center items-center gap-2 ${currentSection === sections.length - 1 ? 'opacity-30 cursor-not-allowed' : 'bg-blue-600 text-white shadow-md active:bg-blue-700'}`}
          >
            Suivant
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </footer>
    </div>
  );
}
