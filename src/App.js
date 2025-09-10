import { useState, useEffect } from "react";
import { Select, Button, Card, message } from "antd";
import { CheckOutlined, CloseOutlined, ReloadOutlined, TrophyOutlined, BulbOutlined } from "@ant-design/icons";

// Define types (using JSDoc comments for JavaScript)
/**
 * @typedef {"a" | "b" | "c"} Category
 * @typedef {Object} TrashItem
 * @property {number} id
 * @property {string} name
 * @property {Category} category
 */

// Business categories data
const businessCategories = [
  { id: "a", name: "HoReCa", emoji: "🍽️" },
  { id: "b", name: "Construcții", emoji: "🏗️" },
  { id: "c", name: "Magazin online/fizic", emoji: "🛒" },
  { id: "d", name: "Educație", emoji: "🎓" },
  { id: "e", name: "Beauty", emoji: "💄" },
  { id: "f", name: "Service auto", emoji: "🔧" },
  { id: "g", name: "Birouri/Servicii", emoji: "🏢" },
  { id: "h", name: "Tipografie", emoji: "🖨️" },
  { id: "i", name: "Producție", emoji: "🏭" },
];

// Trash data with business categories and real images
const trashItems = [
  { id: 1, name: "Deseuri Ulei", image: "deseuri-ulei.jpeg", category: "a" },
  { id: 2, name: "Deseuri Hartie/Carton", image: "deseuri-hartie-carton.jpeg", category: "b" },
  { id: 3, name: "Deseuri Sticla", image: "deseuri-sticla.jpeg", category: "a" },
  { id: 4, name: "Deseuri Municipale", image: "deseuri-municipale.jpeg", category: "b" },
  { id: 5, name: "Deseuri Metalice", image: "deseuri-metalice.jpeg", category: "a" },
  { id: 6, name: "Deseuri Menajere", image: "deseuri-menajere.jpeg", category: "b" },
  { id: 7, name: "Deseuri Auto", image: "deseuri-auto.jpeg", category: "c" },
  { id: 8, name: "Ambalaje Plastic", image: "deseuri-ambalaje-plastic.jpeg", category: "a" },
  { id: 9, name: "Deseuri Constructii", image: "deseuri-constructii.jpeg", category: "c" },
  { id: 10, name: "Ambalaje Sticla", image: "ambalaje-sticla.jpeg", category: "a" },
  { id: 11, name: "DEE-uri", image: "DEE-uri.jpeg", category: "a" },
  { id: 12, name: "Becuri", image: "becuri.jpeg", category: "a" },
  { id: 13, name: "Substante Periculoase", image: "substante-periculoase.jpeg", category: "c" },
  { id: 14, name: "Uleiuri Uzate", image: "uleiuri-uzate.jpeg", category: "c" },
  { id: 15, name: "Deseuri Lemn/Mobilier Vechi", image: "deseuri-lemn-mobilier-vechi.jpeg", category: "c" },
  { id: 16, name: "Deseuri Neferoase", image: "deseuri-neferoase.jpeg", category: "c" },
  { id: 17, name: "Deseuri Textile", image: "deseuri-textile.jpeg", category: "c" },
  { id: 18, name: "Filtre Ulei", image: "filtre-ulei.jpeg", category: "c" },
  { id: 19, name: "Materiale Filtrante", image: "materiale-filtrante.jpeg", category: "c" },
];

// Correct answers for each business category
const correctAnswers = {
  a: [1, 3, 5, 8, 10, 11, 12, 9, 6, 4, 2, 15, 17], // HoReCa - Oil, glass, metal, plastic, glass packaging, electronics, bulbs, construction, household, municipal, paper, wood/furniture, textile
  b: [2, 4, 6, 9, 5, 7, 12, 8, 13, 10, 11, 3, 15, 1, 17, 16, 19, 18], // Construcții - Paper/cardboard, municipal, household, construction, metal, auto, bulbs, plastic, hazardous, glass packaging, electronics, glass, wood/furniture, oil, textile, non-ferrous, filter materials, oil filters
  c: [7, 13, 14, 15, 6, 12, 8, 4, 2, 10, 11, 17], // Magazin online/fizic - Auto, hazardous, used oil, wood/furniture, household, bulbs, plastic, municipal, paper, glass packaging, electronics, textile
  d: [2, 4, 6, 12, 8, 10, 11, 15, 17],          // Educație - Paper/cardboard, municipal, household, bulbs, plastic, glass packaging, electronics, wood/furniture, textile
  e: [1, 3, 8, 11, 6, 12, 4, 2, 13, 10, 15, 17], // Beauty - Oil, glass, plastic, electronics, household, bulbs, municipal, paper, hazardous, glass packaging, wood/furniture, textile
  f: [5, 7, 13, 14, 6, 12, 8, 4, 2, 10, 11, 3, 15, 1, 17, 16, 19, 18], // Service auto - Metal, auto, hazardous, used oil, household, bulbs, plastic, municipal, paper, glass packaging, electronics, glass, wood/furniture, oil, textile, non-ferrous, filter materials, oil filters
  g: [2, 4, 6, 11, 12, 8, 10, 15, 17],          // Birouri/Servicii - Paper, municipal, household, electronics, bulbs, plastic, glass packaging, wood/furniture, textile
  h: [2, 4, 6, 5, 12, 8, 10, 11, 15, 17],       // Tipografie - Paper/cardboard, municipal, household, metal, bulbs, plastic, glass packaging, electronics, wood/furniture, textile
  i: [2, 4, 6, 12, 8, 10, 11, 15, 17, 16, 19, 18], // Producție - Paper, municipal, household, bulbs, plastic, glass packaging, electronics, wood/furniture, textile, non-ferrous, filter materials, oil filters
};

const { Option } = Select;

export default function TrashSortingApp() {
  const [currentStep, setCurrentStep] = useState(0); // 0: welcome, 1: category, 2: items, 3: result
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Scroll to top whenever step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Show all items in the selector (not filtered by category)
  const filteredItems = trashItems;

  // Handle item selection
  const toggleItemSelection = (id) => {
    if (currentStep !== 2) return;
    
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedItems([]);
    setCurrentStep(2);
  };

  // Handle single category selection from grid
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedItems([]);
    setCurrentStep(2);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedCategory) {
      message.warning("Please select a category first");
      return;
    }
    
    const correct = correctAnswers[selectedCategory].sort().join(',') === 
                    selectedItems.sort().join(',');
    
    setIsCorrect(correct);
    setSubmitted(true);
    setCurrentStep(3);
  };

  // Start the game
  const handleStart = () => {
    setCurrentStep(1);
  };

  // Reset the form
  const handleReset = () => {
    setCurrentStep(0);
    setSelectedCategory(null);
    setSelectedItems([]);
    setSubmitted(false);
    setIsCorrect(false);
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #e0f7fa 0%, #f1f8e9 100%)",
      padding: "20px"
    }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        {/* ARYA Logo Header */}
        <div style={{ 
          textAlign: "center", 
          marginBottom: "20px",
          padding: "20px",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <img 
            src="/arya-logo.png" 
            alt="ARYA Logo" 
            style={{ 
              maxWidth: "300px", 
              height: "auto",
              maxHeight: "80px"
            }} 
          />
        </div>

        <Card 
          title={currentStep === 0 ? "Provocarea Sortării Deșeurilor" : `Pasul ${currentStep} din 3`}
          style={{ 
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}
        >
          {/* Step 0: Welcome Screen */}
          {currentStep === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div 
                style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto 24px",
                  background: "linear-gradient(135deg, #8e24aa 0%, #e91e63 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "40px"
                }}
              >
                ♻️
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px", color: "#333" }}>
                Bine ai venit!
              </h2>
              <h3 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "16px", color: "#555" }}>
                Cum să Joci
              </h3>
              <p style={{ color: "#666", maxWidth: "500px", margin: "0 auto 32px", lineHeight: "1.6" }}>
                Acesta este un proces în 3 pași: Mai întâi selectează o categorie, apoi alege elementele care îi aparțin, și în final vezi rezultatele!
              </p>
              <Button
                type="primary"
                onClick={handleStart}
                size="large"
                style={{
                  fontSize: "16px",
                  padding: "12px 32px",
                  height: "auto",
                  borderRadius: "8px"
                }}
              >
                Începe
              </Button>
            </div>
          )}

          {/* Step 1: Category Selection */}
          {currentStep === 1 && (
            <div>
              <p style={{ textAlign: "center", marginBottom: "24px", color: "#555" }}>
                Mai întâi, selectează categoria de afacere pentru care vrei să sortezi deșeurile
              </p>
              
              <div 
                style={{ 
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "16px",
                  marginBottom: "24px"
                }}
              >
                {businessCategories.map(category => (
                  <div 
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    style={{
                      border: "2px solid #e0e0e0",
                      borderRadius: "12px",
                      padding: "16px 12px",
                      textAlign: "center",
                      cursor: "pointer",
                      backgroundColor: "#fff",
                      transition: "all 0.2s",
                      minHeight: "100px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "#4caf50";
                      e.target.style.backgroundColor = "#f1f8e9";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.backgroundColor = "#fff";
                    }}
                  >
                    <div style={{ fontSize: "48px", marginBottom: "12px" }}>
                      {category.emoji}
                    </div>
                    <span style={{ fontSize: "16px", fontWeight: "500" }}>
                      {category.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Item Selection */}
          {currentStep === 2 && (
            <div>
              <p style={{ textAlign: "center", marginBottom: "24px", color: "#555" }}>
                Acum selectează toate elementele care aparțin categoriei <strong>
                  {selectedCategory === "a" && "HoReCa"}
                  {selectedCategory === "b" && "Construcții"}
                  {selectedCategory === "c" && "Magazin online/fizic"}
                  {selectedCategory === "d" && "Educație"}
                  {selectedCategory === "e" && "Beauty"}
                  {selectedCategory === "f" && "Service auto"}
                  {selectedCategory === "g" && "Birouri/Servicii"}
                  {selectedCategory === "h" && "Tipografie"}
                </strong>
              </p>
              
              <div 
                style={{ 
                  background: "#e3f2fd", 
                  border: "1px solid #bbdefb",
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "20px"
                }}
              >
                <p style={{ color: "#0d47a1", textAlign: "center" }}>
                  Apasă pe elementele care aparțin acestei categorii
                </p>
              </div>
            </div>
          )}

           {/* Trash Items Grid */}
           {currentStep === 2 && (
             <div 
               style={{ 
                 display: "grid",
                 gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                 gap: "20px",
                 marginBottom: "24px",
                 maxWidth: "100%"
               }}
             >
               {filteredItems.map(item => {
                 const isSelected = selectedItems.includes(item.id);
                 
                 return (
                   <div 
                     key={item.id}
                     onClick={() => toggleItemSelection(item.id)}
                     style={{
                       border: "2px solid",
                       borderColor: isSelected ? "#4caf50" : "#e0e0e0",
                       borderRadius: "12px",
                       padding: "12px 8px",
                       textAlign: "center",
                       cursor: "pointer",
                       backgroundColor: isSelected ? "#e8f5e9" : "#fff",
                       transition: "all 0.2s",
                       position: "relative"
                     }}
                   >
                     <div 
                       style={{
                         width: "120px",
                         height: "120px",
                         margin: "0 auto 12px",
                         borderRadius: "12px",
                         overflow: "hidden",
                         border: "2px solid #e0e0e0"
                       }}
                     >
                       <img 
                         src={`/images/${item.image}`}
                         alt={item.name}
                         style={{
                           width: "100%",
                           height: "100%",
                           objectFit: "cover",
                           maxWidth: "200px",
                           maxHeight: "200px"
                         }}
                         loading="lazy"
                         onError={(e) => {
                           e.target.style.display = "none";
                           e.target.nextSibling.style.display = "flex";
                         }}
                       />
                       <div 
                         style={{
                           width: "100%",
                           height: "100%",
                           background: "#eeeeee",
                           border: "2px dashed #bdbdbd",
                           borderRadius: "8px",
                           display: "none",
                           alignItems: "center",
                           justifyContent: "center"
                         }}
                       >
                         <span style={{ fontSize: "12px", color: "#9e9e9e" }}>{item.id}</span>
                       </div>
                     </div>
                     <span style={{ fontSize: "14px", fontWeight: "500", textAlign: "center", lineHeight: "1.3" }}>{item.name}</span>
                   </div>
                 );
               })}
             </div>
           )}

           {/* Action Buttons */}
           {currentStep === 2 && (
             <div style={{ display: "flex", gap: "12px" }}>
                 <Button
                   type="primary"
                   onClick={handleSubmit}
                   disabled={selectedItems.length === 0}
                   size="large"
                   style={{ flex: 1 }}
                 >
                   Trimite Selecția
                 </Button>
             </div>
           )}

           {/* Step 3: Result Card */}
           {currentStep === 3 && (
             <Card
               style={{
                 marginTop: "20px",
                 border: `2px solid ${isCorrect ? "#4caf50" : "#f44336"}`,
                 backgroundColor: isCorrect ? "#f1f8e9" : "#ffebee"
               }}
             >
               <div style={{ textAlign: "center" }}>
                 <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                   {isCorrect ? (
                     <TrophyOutlined style={{ color: "#4caf50" }} />
                   ) : (
                     <BulbOutlined style={{ color: "#f44336" }} />
                   )}
                 </div>
                 <h3 style={{ 
                   color: isCorrect ? "#2e7d32" : "#c62828",
                   marginBottom: "8px"
                 }}>
                   {isCorrect ? "🎉 Felicitări! 🎉" : "⚠️ Aproape! ⚠️"}
                 </h3>
                 <div style={{ 
                   color: isCorrect ? "#388e3c" : "#d32f2f",
                   marginBottom: "20px",
                   textAlign: "left",
                   lineHeight: "1.6",
                   fontSize: "14px"
                 }}>
                   {isCorrect ? (
                     <div>
                       <p style={{ marginBottom: "16px", fontSize: "16px", fontWeight: "500" }}>
                         Ai reușit să identifici toate tipurile de deșeuri pe care le produce afacerea ta! 👏
                       </p>
                       <p style={{ marginBottom: "16px", fontSize: "15px" }}>
                         🔎 Asta înseamnă că ești atent(ă) la detalii și conștient(ă) de impactul pe care îl are fiecare activitate asupra mediului. 🌍
                       </p>
                       <p style={{ marginBottom: "16px", fontSize: "15px" }}>
                         ✅ Următorul pas este să gestionezi corect aceste deșeuri, pentru a evita amenzile (PS. au minim patru 0-uri) și pentru a transforma afacerea ta într-un exemplu de responsabilitate.
                       </p>
                       <p style={{ marginBottom: "20px", fontSize: "15px" }}>
                         ♻️ Împreună putem construi un viitor mai curat și mai verde pentru copii de mâine!
                       </p>
                       <div style={{ 
                         marginTop: "20px", 
                         padding: "20px 16px", 
                         backgroundColor: "#f8f9fa", 
                         borderRadius: "12px",
                         border: "1px solid #e9ecef"
                       }}>
                         <p style={{ marginBottom: "16px", fontWeight: "600", fontSize: "16px" }}>
                           👉𝐍𝐮 𝐮𝐢𝐭𝐚 𝐜𝐚̆:
                         </p>
                         <p style={{ marginBottom: "12px", fontSize: "15px", lineHeight: "1.5" }}>
                           🤦‍♀️𝐍𝐮 𝐜𝐨𝐧𝐝𝐮𝐜𝐢 𝐨 𝐚𝐟𝐚𝐜𝐞𝐫𝐞, 𝐜𝐚 𝐬𝐚̆ 𝐟𝐢𝐢 𝐬𝐭𝐫𝐞𝐬𝐬𝐚𝐭 𝐝𝐢𝐧 𝐜𝐚𝐮𝐳𝐚 𝐜𝐨𝐧𝐭𝐫𝐨𝐚𝐥𝐞𝐥𝐨𝐫.
                         </p>
                         <p style={{ marginBottom: "20px", fontSize: "15px", lineHeight: "1.5" }}>
                           🤦‍♀️𝐍𝐮 𝐟𝐚𝐜𝐢 𝐛𝐚𝐧𝐢, 𝐜𝐚 𝐬𝐚̆ 𝐩𝐥𝐚̆𝐭𝐞𝐬̦𝐭𝐢 𝐚𝐦𝐞𝐧𝐳𝐢!
                         </p>
                         <div style={{ 
                           textAlign: "center", 
                           padding: "16px 12px", 
                           backgroundColor: "#e3f2fd", 
                           borderRadius: "8px",
                           border: "1px solid #bbdefb"
                         }}>
                           <p style={{ marginBottom: "12px", fontWeight: "600", fontSize: "15px" }}>
                             Semnat,
                           </p>
                           <p style={{ marginBottom: "12px", fontWeight: "700", fontSize: "18px", lineHeight: "1.4" }}>
                             𝐀𝐍𝐃𝐑𝐀𝐃𝐀 𝐕𝐈𝐙𝐈𝐑𝐄𝐀𝐍𝐔 - "𝐒𝐮𝐧𝐭 𝐦𝐚𝐢 𝐫𝐞𝐧𝐭𝐚𝐛𝐢𝐥𝐚̆ 𝐝𝐞𝐜𝐚̂𝐭 𝐨 𝐀𝐦𝐞𝐧𝐝𝐚̆!"😎
                           </p>
                           <p style={{ marginBottom: "8px", fontSize: "15px" }}>
                             ● Consultant & Auditor Intern
                           </p>
                           <p style={{ marginBottom: "0", fontSize: "16px", fontWeight: "600" }}>
                             Telefon: <a 
                               href="tel:+40751518494" 
                               style={{ 
                                 color: "#1976d2", 
                                 textDecoration: "none",
                                 fontWeight: "600"
                               }}
                               onClick={(e) => {
                                 e.preventDefault();
                                 // Try to add to contacts
                                 if (navigator.contacts) {
                                   navigator.contacts.create({
                                     name: "ANDRADA VIZIREANU",
                                     phone: "0751 518 494"
                                   });
                                 } else {
                                   // Fallback to phone call
                                   window.location.href = "tel:+40751518494";
                                 }
                               }}
                             >
                               0751 518 494
                             </a>
                           </p>
                         </div>
                       </div>
                     </div>
                   ) : (
                     <div>
                       <p style={{ marginBottom: "16px", fontSize: "15px" }}>
                         Ai identificat o parte din deșeurile generate de activitatea ta, dar ți-au scăpat câteva.
                       </p>
                       <div style={{ marginBottom: "16px" }}>
                         <p style={{ marginBottom: "12px", fontSize: "15px", fontWeight: "600" }}>
                           👉 Uite ce era corect:
                         </p>
                         <div style={{ 
                           backgroundColor: "#d4edda", 
                           border: "1px solid #c3e6cb",
                           borderRadius: "8px",
                           padding: "12px",
                           marginBottom: "12px"
                         }}>
                           {(() => {
                             const correctItems = correctAnswers[selectedCategory] || [];
                             return correctItems.map(id => {
                               const item = trashItems.find(item => item.id === id);
                               return item ? (
                                 <div key={id} style={{ 
                                   display: "flex", 
                                   alignItems: "center", 
                                   marginBottom: "8px",
                                   fontSize: "14px"
                                 }}>
                                   <span style={{ marginRight: "8px", color: "#28a745" }}>✓</span>
                                   <span>{item.name}</span>
                                 </div>
                               ) : null;
                             });
                           })()}
                         </div>
                       </div>
                       <p style={{ marginBottom: "16px", fontSize: "15px" }}>
                         🔎 Cunoașterea completă a deșeurilor este importantă pentru a ști cum să le gestionezi corect și pentru a evita sancțiuni.
                       </p>
                       <p style={{ marginBottom: "20px", fontSize: "15px" }}>
                         💪 Mai încearcă o dată! Poți să le nimerești pe toate și să devii un adevărat campion al reciclării ♻️🏆
                       </p>
                       <div style={{ 
                         marginTop: "20px", 
                         padding: "20px 16px", 
                         backgroundColor: "#f8f9fa", 
                         borderRadius: "12px",
                         border: "1px solid #e9ecef"
                       }}>
                         <p style={{ marginBottom: "16px", fontWeight: "600", fontSize: "16px" }}>
                           👉𝐍𝐮 𝐮𝐢𝐭𝐚 𝐜𝐚̆:
                         </p>
                         <p style={{ marginBottom: "12px", fontSize: "15px", lineHeight: "1.5" }}>
                           🤦‍♀️𝐍𝐮 𝐜𝐨𝐧𝐝𝐮𝐜𝐢 𝐨 𝐚𝐟𝐚𝐜𝐞𝐫𝐞, 𝐜𝐚 𝐬𝐚̆ 𝐟𝐢𝐢 𝐬𝐭𝐫𝐞𝐬𝐬𝐚𝐭 𝐝𝐢𝐧 𝐜𝐚𝐮𝐳𝐚 𝐜𝐨𝐧𝐭𝐫𝐨𝐚𝐥𝐞𝐥𝐨𝐫.
                         </p>
                         <p style={{ marginBottom: "20px", fontSize: "15px", lineHeight: "1.5" }}>
                           🤦‍♀️𝐍𝐮 𝐟𝐚𝐜𝐢 𝐛𝐚𝐧𝐢, 𝐜𝐚 𝐬𝐚̆ 𝐩𝐥𝐚̆𝐭𝐞𝐬̦𝐭𝐢 𝐚𝐦𝐞𝐧𝐳𝐢!
                         </p>
                         <div style={{ 
                           textAlign: "center", 
                           padding: "16px 12px", 
                           backgroundColor: "#e3f2fd", 
                           borderRadius: "8px",
                           border: "1px solid #bbdefb"
                         }}>
                           <p style={{ marginBottom: "12px", fontWeight: "600", fontSize: "15px" }}>
                             Semnat,
                           </p>
                           <p style={{ marginBottom: "12px", fontWeight: "700", fontSize: "18px", lineHeight: "1.4" }}>
                             𝐀𝐍𝐃𝐑𝐀𝐃𝐀 𝐕𝐈𝐙𝐈𝐑𝐄𝐀𝐍𝐔 - "𝐒𝐮𝐧𝐭 𝐦𝐚𝐢 𝐫𝐞𝐧𝐭𝐚𝐛𝐢𝐥𝐚̆ 𝐝𝐞𝐜𝐚̂𝐭 𝐨 𝐀𝐦𝐞𝐧𝐝𝐚̆!"😎
                           </p>
                           <p style={{ marginBottom: "8px", fontSize: "15px" }}>
                             ● Consultant & Auditor Intern
                           </p>
                           <p style={{ marginBottom: "0", fontSize: "16px", fontWeight: "600" }}>
                             Telefon: <a 
                               href="tel:+40751518494" 
                               style={{ 
                                 color: "#1976d2", 
                                 textDecoration: "none",
                                 fontWeight: "600"
                               }}
                               onClick={(e) => {
                                 e.preventDefault();
                                 if (navigator.contacts) {
                                   navigator.contacts.create({
                                     name: "ANDRADA VIZIREANU",
                                     phone: "0751 518 494"
                                   });
                                 } else {
                                   window.location.href = "tel:+40751518494";
                                 }
                               }}
                             >
                               0751 518 494
                             </a>
                           </p>
                         </div>
                       </div>
                     </div>
                   )}
                 </div>
                 <Button
                   type="primary"
                   onClick={handleReset}
                   icon={<ReloadOutlined />}
                   size="large"
                   style={{
                     backgroundColor: isCorrect ? "#4caf50" : "#f44336",
                     borderColor: isCorrect ? "#4caf50" : "#f44336"
                   }}
                 >
                   Încearcă Din Nou
                 </Button>
               </div>
             </Card>
           )}

        </Card>
      </div>
    </div>
  );
}