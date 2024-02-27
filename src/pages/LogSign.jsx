import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

//inscription form
const SignUpForm = () => {
  const [signUpFormData, setSignUpFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
  });

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      // Envoyer la requête à votre backend
      const response = await fetch("http://localhost:3000/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpFormData),
      });

      if (response.ok) {
        const data = await response.json();

        console.log("Token reçu du backend:", data.token);
        toast.success("Vous êtes bien inscrit !");

        // Reset les inputs
        setSignUpFormData({
          firstName: "",
          lastName: "",
          age: "",
          email: "",
          password: "",
        });
      } else {
        // Gérer les erreurs ici
        console.error("Erreur lors de la requête:", response.status);
        toast.error("Deja inscrit avec cet email.");
      }
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
      toast.error("Deja inscrit avec cet email.");
    }
  };

  const handleInputSignUpChange = (e) => {
    setSignUpFormData({ ...signUpFormData, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full ">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Inscription</h1>
      </div>
      <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
        <form
          action="#"
          className="mx-auto mb-0 max-w-md space-y-4 p-6"
          onSubmit={handleSignUp}
        >
          {/* Nom, Prénom, et Âge en ligne */}
          <div className="flex flex-wrap -mx-3 mb-6">
            {/* nom */}
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label htmlFor="lastname" className="sr-only">
                Nom
              </label>
              <input
                type="text"
                name="lastName"
                className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
                required // Ajout de l'attribut required
                placeholder="Nom"
                onChange={handleInputSignUpChange}
              />
            </div>
            {/* prénom */}
            <div className="w-full md:w-1/3 px-3">
              <label htmlFor="firstname" className="sr-only">
                Prénom
              </label>
              <input
                type="text"
                name="firstName"
                className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
                required // Ajout de l'attribut required
                placeholder="Prénom"
                onChange={handleInputSignUpChange}
              />
            </div>
            {/* Âge */}
            <div className="w-full md:w-1/4 px-3">
              <label htmlFor="age" className="sr-only">
                Âge
              </label>
              <input
                type="number"
                name="age"
                className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
                required // Ajout de l'attribut required
                placeholder="Âge"
                onChange={handleInputSignUpChange}
              />
            </div>
          </div>
          {/* EMAIL */}
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                required // Ajout de l'attribut required
                placeholder="Email"
                onChange={handleInputSignUpChange}
              />
            </div>
          </div>
          {/* PASSWORD */}
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                required // Ajout de l'attribut required
                placeholder="Mots passe"
                onChange={handleInputSignUpChange}
              />
            </div>
          </div>
          {/* SUBMIT */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white uppercase hover:bg-blue-700 transition duration-300"
            >
              s'inscrire
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

//connexion form
const ConnexionForm = () => {
  const navigate = useNavigate();
  const [connexionFormData, setConnexionFormData] = useState({
    email: "",
    password: "",
  });

  const handleConnexion = async (e) => {
    e.preventDefault();

    try {
      // Envoyer la requête à votre backend pour la connexion
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(connexionFormData),
      });

      if (response.ok) {
        const data = await response.json();
        //Sauvegarde du token dans le local storage
        localStorage.setItem("token", data.token);
        localStorage.setItem("lastName", data.lastName);
        console.log("Token reçu du backend:", data.token);
        navigate("/");
        // Réinitialiser les champs du formulaire de connexion
        setConnexionFormData({
          email: "",
          password: "",
        });

        // Vérifier si une redirection spécifique est demandée
        const redirectPath = localStorage.getItem("loginRedirect");
        if (redirectPath) {
          navigate(redirectPath); // Rediriger vers le chemin spécifié
          localStorage.removeItem("loginRedirect"); // Nettoyer la redirection du localStorage
        } else {
          navigate("/"); // Rediriger vers la page d'accueil par défaut
        }
      } else {
        // Gérer les erreurs ici

        console.error("Erreur lors de la requête:", response.status);
        toast.error("Mauvais email ou mot de passe.");
      }
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
      toast.error("Mauvais email ou mot de passe.");
    }
  };

  const handleInputConnexionChange = (e) => {
    setConnexionFormData({
      ...connexionFormData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full ">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Connexion</h1>
      </div>
      <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
        <form
          action="#"
          className="mx-auto mb-0 max-w-md space-y-4 p-6"
          onSubmit={handleConnexion}
        >
          {/* EMAIL */}
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                required // Ajout de l'attribut required
                placeholder="Email"
                onChange={handleInputConnexionChange}
              />
            </div>
          </div>
          {/* PASSWORD */}
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                required // Ajout de l'attribut required
                placeholder="mots passe"
                onChange={handleInputConnexionChange}
              />
            </div>
          </div>
          {/* SUBMIT */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white uppercase hover:bg-blue-700 transition duration-300"
            >
              Connexion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function LogSign() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get("mode"); // 'login' ou null

  return (
    <main className="isolate ">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        style={{ top: "100px" }}
      />
      <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen">
        {mode === "login" ? (
          // Affiche uniquement le formulaire de connexion si mode=login
          <section className="w-full px-4 py-12 sm:px-6 sm:py-16">
            <ConnexionForm />
          </section>
        ) : (
          // Sinon, affichez les deux formulaires comme avant
          <>
            <section className="relative w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2">
              <SignUpForm />
            </section>
            <section className="relative w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2">
              <ConnexionForm />
            </section>
          </>
        )}
      </div>
    </main>
  );
}
