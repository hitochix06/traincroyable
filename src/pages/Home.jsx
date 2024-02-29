import moment from "moment";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Animation from "../lotties/train.json";
import Lottie from "lottie-react";

export default function Home() {
  //Tableau affichage ed données front
  const posts = [
    {
      id: 1,
      title: "Paris",
      description:
        "Paris est la capitale de la France. Elle est située au cœur d'une vaste plaine fertile au climat tempéré, le Bassin parisien, sur une boucle de la Seine, entre les confluents de celle-ci avec la Marne et l'Oise.",
      imageUrl:
        "https://res.klook.com/image/upload/Mobile/City/swox6wjsl5ndvkv5jvum.jpg",
    },

    {
      id: 2,
      title: "Lyon",
      description:
        "Lyon est une ville du centre-est de la France, située dans la région Auvergne-Rhône-Alpes, au confluent du Rhône et de la Saône. Son centre-ville médiéval, Renaissance et moderne est inscrit au patrimoine mondial de l'UNESCO.",
      imageUrl:
        "https://mediaim.expedia.com/destination/1/0877ac2d5b8f5ee1b17bae44c3174d48.jpg",
    },

    {
      id: 3,
      title: "Bruxelles",
      description:
        "Bruxelles est la capitale de la Belgique et de la Région de Bruxelles-Capitale. Elle abrite les institutions de l'Union européenne, dont la Commission européenne, le Parlement européen et le Conseil de l'Union européenne.",
      imageUrl:
        "https://oudormirtop.com/wp-content/uploads/2020/08/oudormirabruxelles-785x524.jpg",
    },
  ];

  //Variable d'état qui contiendra les valeurs saisis par l'utilisateur dans l'input
  const [formData, setFormData] = useState({
    depart: "",
    arrive: "",
    date: "",
  });

  //USE STATES
  const [isLoading, setIsLoading] = useState(false); // Variable d'état pour la barre de chargement
  const [searchResults, setSearchResults] = useState([]); //Resultat de la recherche
  const [selectedTrips, setSelectedTrips] = useState([]); //Trip ajoutés dans le panier

  // stock dans la variale d'état les valeurs des inputs à leurs changements
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSearch = async () => {
    setIsLoading(true); // Activez la barre de chargement
    // Formatage date avec moment, on donne un intervalle pour afficher tous les trajets du jour
    const startDate = moment(formData.date, "YYYY-MM-DD")
      .startOf("day")
      .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    const endDate = moment(formData.date, "YYYY-MM-DD")
      .endOf("day")
      .format("YYYY-MM-DDTHH:mm:ss.SSSZ");

    // Fetch vers le back pour rechercher les trajets avec les valeurs saisies
    const response = await fetch("http://localhost:3000/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        departure: formData.depart,
        arrival: formData.arrive,
        date: { $gte: startDate, $lte: endDate },
      }),
    });

    if (response.ok) {
      let trips = await response.json();
      // Utilisez setTimeout pour retarder la mise à jour de l'état

      trips = trips.sort((a, b) => a.price - b.price);
      setTimeout(() => {
        setSearchResults(trips);
        setIsLoading(false); // Désactivez la barre de chargement après un délai
      }, 3000); // Retarde de 2000 millisecondes (3 secondes)
    } else {
      console.error("Erreur lors de la recherche de trajets.");
      toast.error("Erreur lors de la recherche.");
      setIsLoading(false); // Assurez-vous de désactiver la barre de chargement même en cas d'erreur
    }
  };

  //Function add to cart
  const handleChoose = async (tripId) => {
    try {
      const response = await fetch("http://localhost:3000/add-to-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);

        // On récup le tableau de base dans le localStorage
        const currentCart = JSON.parse(localStorage.getItem("cart")) || [];

        // Ajoutez le nouvel ID à ce tableau
        const updatedCart = [...currentCart, tripId];

        // Save dans le localStorage
        localStorage.setItem("cart", JSON.stringify(updatedCart));

        //On met à jour le usestate selectedTrips avec les id ajoutés
        setSelectedTrips([...selectedTrips, tripId]);

        // Affichez un toast de succès
        toast.success("Ajouté dans le panier !");
      } else {
        console.error("Erreur lors de l'ajout du trajet au panier.");
        // Affichez un toast d'erreur
        toast.error("Erreur lors de l'ajout au panier.");
      }
    } catch (error) {
      console.error(error);
      // Affichez un toast d'erreur
      toast.error("Erreur lors de l'ajout au panier.");
    }
  };

  return (
    <main className="isolate">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        style={{ top: "100px" }}
      />
      {/* Hero section */}
      <div className="relative isolate -z-10">
        <video
          className="absolute inset-0 w-full h-full object-cover -z-10 "
          autoPlay
          muted
          loop
        >
          <source src="assets/video.mp4" type="video/mp4" />
        </video>

        <div className="relative isolate -z-10">
          <div className="overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                  <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl p-10 slide-in text-shadow">
                    Et si vous parcouriez le monde en train
                  </h2>
                  <p className="relative mt-6 text-lg leading-8 text-white sm:max-w-md lg:max-w-none slide-in text-shadow ">
                    comparez les prix des billets de train et trouvez les
                    meilleurs tarifs pour vos trajets en France et en Europe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* section centrée avec ajustement des colonnes */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 max-w-6xl">
          {" "}
          {/* Utilisez 3 colonnes au lieu de 2 pour un contrôle plus fin */}
          {/* Première carte avec formulaire, occupe 1 fraction */}
          <div className="md:col-span-1 bg-white p-8">
            {" "}
            {/* Ajustez pour que cette div occupe 1/3 de l'espace disponible */}
            <h3 className="text-xl font-semibold mb-6">Où allez-vous?</h3>
            <form>
              <div className="mb-6">
                {" "}
                {/* Augmentez le margin-bottom */}
                <label
                  htmlFor="depart"
                  className="block text-base font-medium text-gray-700"
                >
                  Départ
                </label>{" "}
                {/* Augmentez la taille du texte */}
                <input
                  type="text"
                  id="depart"
                  name="depart"
                  value={formData.depart}
                  onChange={handleInputChange}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-base"
                  placeholder="Ville de départ"
                />{" "}
                {/* Augmentez la taille du texte et le margin-top */}
              </div>
              <div className="mb-6">
                <label
                  htmlFor="arrive"
                  className="block text-base font-medium text-gray-700"
                >
                  Arrivée
                </label>
                <input
                  type="text"
                  id="arrive"
                  name="arrive"
                  value={formData.arrive}
                  onChange={handleInputChange}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-base"
                  placeholder="Ville d'arrivée"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="date"
                  className="block text-base font-medium text-gray-700"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={moment(formData.date, "YYYY-MM-DD").format(
                    "YYYY-MM-DD"
                  )} /* On passe le même format de date que mangoDB */
                  onChange={handleInputChange}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base"
                />
              </div>
              <button
                type="button"
                onClick={handleSearch}
                className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Rechercher les meilleurs prix
              </button>
            </form>
          </div>
          {/* Section des meilleurs prix */}
          <div className="md:col-span-2 bg-white shadow-lg rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-6 text-center uppercase">
              meilleur prix
            </h3>
            {!isLoading && searchResults.length === 0 && (
              <div className="flex justify-center items-center h-full">
                <div className="text-center text-gray-600 mb-6 animate-pulse">
                  Sélectionnez votre voyage parmi les options ci-dessous pour
                  les meilleurs tarifs disponibles.
                </div>
              </div>
            )}
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div className="w-full bg-gray-200 rounded-full">
                  <Lottie animationData={Animation} />
                </div>
              </div>
            ) : (
              searchResults.map((result, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center shadow-lg p-4 mb-4"
                >
                  <div>
                    <h4 className="text-xl font-semibold">
                      {result.departure} {">"} {result.arrival}
                    </h4>
                    <p className="text-lg">
                      {moment(result.date).format("HH:mm")}
                    </p>
                    <p className="text-lg font-bold text-black">
                      Prix: {result.price}€
                    </p>
                  </div>
                  <button
                    onClick={() => handleChoose(result._id)}
                    className={`inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md ${
                      selectedTrips.includes(result._id)
                        ? "bg-gray-400 hover:bg-gray-500 text-white cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    disabled={selectedTrips.includes(result._id)}
                  >
                    Choisir
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* section carte voyage */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Nos voyages en train les plus populaires
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              voyager en train est une expérience unique, découvrez nos voyages
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
              >
                <img
                  src={post.imageUrl}
                  alt=""
                  className="absolute inset-0 -z-10 h-full w-full object-cover"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

                <h1 className="mt-3 text-lg font-semibold leading-6 text-white">
                  <a href={post.href}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </a>
                </h1>
                <p className="mt-2 text-base leading-7 text-gray-300">
                  {post.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
