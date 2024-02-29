import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";

export default function Cart() {
  const [userAge, setUserAge] = useState(null); // Initialiser à null
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  const handlePaymentClick = () => {
    if (!isLoggedIn) {
      // Si l'utilisateur n'est pas connecté, définissez la page de redirection et redirigez vers la page de connexion
      localStorage.setItem("loginRedirect", "/cart"); // Définir la page de redirection vers le panier
      navigate("/logSign?mode=login"); // Rediriger vers la page de connexion
    } else {
      // Logique de paiement ici si l'utilisateur est connecté
      // Par exemple, rediriger vers une page de paiement ou afficher un formulaire de paiement
    }
  };

  const calculateTotalAndSavings = () => {
    let totalSavings = 0;
    let total = 0;

    cartItems.forEach((item) => {
      let prixInitial = item.price;
      let prixItem = prixInitial;
      let reduction = 0;

      // Réduction de 10% pour les articles de plus de 75€ pour tous les utilisateurs
      if (prixItem > 75) {
        reduction = prixItem * 0.1;
        prixItem -= reduction;
        totalSavings += reduction;
      }

      // Réduction supplémentaire de 10% pour les utilisateurs de moins de 25 ans,
      // appliquée uniquement si l'utilisateur est connecté et que la première réduction n'a pas été appliquée
      if (isLoggedIn && userAge < 25 && prixInitial <= 75) {
        reduction = prixItem * 0.1;
        prixItem -= reduction;
        totalSavings += reduction;
      }

      total += prixItem;
    });

    return { total, totalSavings };
  };

  useEffect(() => {
    // Vérifiez si un token existe dans le localStorage
    const token = localStorage.getItem("token");
    // Si un token existe, considérez l'utilisateur comme connecté
    if (token) {
      setIsLoggedIn(true);
      // Supposons que l'âge de l'utilisateur est stocké dans le localStorage sous la clé 'userAge'
      const age = localStorage.getItem("age");
      if (age) {
        setUserAge(parseInt(age, 10)); // Convertir en nombre et définir l'âge
      }
    }
    // Récupérer les IDs depuis le local storage
    const storedIds = JSON.parse(localStorage.getItem("cart")) || [];

    // Envoyer une requête au backend pour récupérer les détails des trajets
    const fetchCartItems = async () => {
      try {
        const response = await fetch("http://localhost:3000/get-cart-items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tripIds: storedIds }),
        });

        if (response.ok) {
          const items = await response.json();
          setCartItems(items);
        } else {
          console.error(
            "Erreur lors de la récupération des trajets du panier."
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCartItems();
  }, []); // Fait la requête qu'une fois au chargement initial

  const addToReservations = async () => {
    try {
      // Récupérer le token depuis le localStorage pour authentifier l'utilisateur
      const token = localStorage.getItem("token");

      // Récupérer les identifiants des trajets actuellement dans le panier
      const idsTrajetsPanier = JSON.parse(localStorage.getItem("cart")) || [];

      // Effectuer une requête au serveur pour ajouter les trajets sélectionnés aux réservations de l'utilisateur
      const reponse = await fetch("http://localhost:3000/add-to-reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Envoyer le token et les identifiants des trajets pour les ajouter aux réservations de l'utilisateur
        body: JSON.stringify({ token, trips: idsTrajetsPanier }),
      });
      if (reponse.ok) {
        // Vider le panier et mettre à jour l'état local après l'ajout réussi aux réservations
        setCartItems([]);
        localStorage.removeItem("cart"); // Supprimer les trajets du panier local après leur ajout aux réservations
        navigate("/reservation"); // Rediriger l'utilisateur vers la page des réservations
      } else {
        console.error("Erreur lors de l'ajout des trajets aux réservations.");
      }
    } catch (erreur) {
      console.error(
        "Erreur lors de l'ajout des trajets aux réservations.",
        erreur
      );
    }
  };

  const handleRemoveFromCart = async (tripId) => {
    try {
      // Récupérer les IDs actuels depuis le local storage
      const storedIds = JSON.parse(localStorage.getItem("cart")) || [];

      // Filtrer l'ID que vous souhaitez supprimer
      const updatedIds = storedIds.filter((id) => id !== tripId);

      // Mettre à jour le local storage avec les nouveaux IDs
      localStorage.setItem("cart", JSON.stringify(updatedIds));

      // Mettre à jour l'état ou effectuer toute autre action nécessaire dans votre application
      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== tripId)
      );

      // Affichez un toast après la suppression réussie
      toast.success(`supprimé du panier.`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      console.log(`Trajet avec l'ID ${tripId} supprimé du panier.`);
    } catch (error) {
      toast.error("Erreur lors de la suppression du trajet du panier.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="bg-white">
      <main className="isolate">
        {/* Image section */}

        <ToastContainer
          position="top-right"
          autoClose={2000}
          style={{ top: "100px" }}
        />
        <div className="flex justify-center items-center min-h-screen">
          <div className="mt-32 sm:mt-40 xl:mx-auto xl:max-w-7xl xl:px-8">
            <div className="text-center py-8">
              <div className="mt-6">
                <div className="max-w-4xl mx-auto">
                  {/* Info, occupe 2 fractions */}
                  <div className="md:col-span-2 bg-white shadow-lg rounded-lg p-8">
                    {/* Ajustez pour que cette div occupe 2/3 de l'espace disponible */}
                    <h2 className="text-3xl font-bold text-gray-800">
                      Mon Panier
                    </h2>
                    {cartItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex flex-col lg:flex-row justify-between items-center shadow-lg p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:flex-grow sm:items-center space-x-0 sm:space-x-10 space-y-2 sm:space-y-0">
                          <h4 className="text-xl font-semibold flex-shrink-0">
                            {item.departure} {">"} {item.arrival}
                          </h4>
                          <p className="text-lg flex-shrink-0">
                            {moment(item.date).format("HH:mm")}
                          </p>
                          <div className="text-lg flex-shrink-0 ">
                            <span className="font-bold text-black">Prix: </span>
                            {isLoggedIn ? (
                              userAge < 25 ? (
                                <>
                                  <span className="line-through">
                                    {item.price}€{" "}
                                  </span>
                                  <span className="font-bold text-red-500 ml-2">
                                    {" "}
                                    {" -10% "}
                                    {(item.price * 0.9).toFixed(2)}€
                                  </span>
                                </>
                              ) : (
                                <span>{item.price}€</span>
                              )
                            ) : item.price > 75 ? (
                              <>
                                <span className="line-through">
                                  {item.price}€
                                </span>
                                <span className="font-bold text-red-500 ml-2">
                                  {" "}
                                  {" -10% "}
                                  {(item.price * 0.9).toFixed(2)}€
                                </span>
                              </>
                            ) : (
                              <span>{item.price}€</span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(item._id)}
                          className="mt-5 sm:mt-4 sm:ml-4 inline-flex items-center justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <div className="flex justify-between items-center mt-8 p-4 bg-gray-100 rounded-lg">
                      <h3 className="text-xl font-semibold">Total Prix : </h3>
                      <p className="text-xl">
                        {calculateTotalAndSavings().total.toFixed(2)}€
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-4 p-4 bg-gray-100 rounded-lg">
                      <h3 className="text-xl font-semibold">
                        Économies réalisées :{" "}
                      </h3>
                      <p className="text-xl">
                        {calculateTotalAndSavings().totalSavings.toFixed(2)}€
                      </p>
                    </div>
                    <div className="flex justify-end space-x-4 mt-8">
                      {/* Le bouton Payer n'apparaît que si `isLoggedIn` est `true` */}
                      {isLoggedIn && (
                        <button
                          onClick={addToReservations}
                          className="inline-flex items-center justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 uppercase"
                        >
                          Payer
                        </button>
                      )}
                      {/* Le bouton Se connecter pour payer n'apparaît que si `isLoggedIn` est `false` */}
                      {!isLoggedIn && (
                        <button
                          onClick={handlePaymentClick}
                          className="inline-flex items-center justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 uppercase"
                        >
                          Se connecter pour payer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
