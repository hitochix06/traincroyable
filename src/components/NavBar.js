import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Panier", href: "/cart" },
  { name: "Réservation", href: "/reservation" },
];

const handleDeconnexion = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("lastName");
  console.log("Utilisateur déconnecté");
  alert("Vous êtes maintenant déconnecté.");
  window.location.reload();
};

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const estConnecte = localStorage.getItem("token");
  const nomUtilisateur = localStorage.getItem("lastName");

  return (
    <div className="">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50 bg-black-100 bg-opacity-25 ">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8  "
          aria-label="Global"
        >
          <div className="flex lg:flex-1 items-center ">
            <a href="/" className="-m-1.5 p-1.5">
              <img
                className={`h-20 w-auto  ${
                  location.pathname === "/"
                    ? "class-pour-home"
                    : "class-pour-autres-pages"
                }`}
                src={
                  location.pathname === "/"
                    ? "assets/logoblanc.svg"
                    : "assets/logoblack.svg"
                }
                alt="logo compagnie"
              />
            </a>
            <span
              className={`ml-2 uppercase  ${
                location.pathname === "/"
                  ? "text-white text-shadow "
                  : "text-black"
              }`}
            >
              TrainCroyable
            </span>
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              className={`-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 ${
                location.pathname === "/" ? "text-white " : "text-black"
              }`}
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12 uppercase ">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-semibold leading-6 ${
                  location.pathname === "/"
                    ? "text-white text-shadow "
                    : "text-black"
                } hover:border-b hover:border-blue-500`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {/* Affichez le bouton de déconnexion si l'utilisateur est connecté, sinon affichez le bouton de connexion */}
            {estConnecte ? (
              <>
                <div className="flex items-center">
                  <div className="mr-4 flex items-center justify-center h-8 w-8 rounded-full bg-white-500 text-white text-shadow ">
                    {/* Remplacez-la par une image générée à partir de robohash.org */}
                    <img
                      className="rounded-full"
                      src={`https://robohash.org/${nomUtilisateur}?set=set1&size=128x128`}
                      alt="Avatar Utilisateur"
                    />
                  </div>

                  {/* Ajout du nom de l'utilisateur sous la pastille */}
                  <span
                    className={`font-bold text-ms ${
                      location.pathname === "/" ? "text-white" : "text-black"
                    } mr-6 uppercase`}
                  >
                    {nomUtilisateur}
                  </span>
                </div>
                <button
                  onClick={handleDeconnexion}
                  className="inline-flex items-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link to="/logsign">
                <button className="ml-6 inline-flex items-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Connexion
                </button>
              </Link>
            )}
          </div>
        </nav>

        {/* Pour mobile */}
        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="/" className="-m-1.5 p-1.5">
                <img
                  className="h-8 w-auto"
                  src="assets/logo.jpg"
                  alt="logo compagnie"
                />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                {/* Ajout du bouton de déconnexion pour mobile */}
                {estConnecte ? (
                  <div className="py-6">
                    <button
                      onClick={handleDeconnexion}
                      className="-mx-3 block w-full rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white bg-blue-500 hover:bg-blue-700"
                    >
                      Déconnexion
                    </button>
                  </div>
                ) : (
                  <div className="py-6">
                    <Link to="/logsign">
                      <button className="-mx-3 block w-full rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                        Connexion
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
    </div>
  );
}
