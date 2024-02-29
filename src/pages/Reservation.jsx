import React, { useState, useEffect } from "react";
import moment from "moment";

export default function Reservation() {
  const [userReservations, setUserReservations] = useState([]);

  useEffect(() => {
    const fetchUserReservations = async () => {
      try {
        // Effectuez une requête à la route user-reservations pour obtenir les réservations de l'utilisateur
        const response = await fetch(
          "http://localhost:3000/user-reservations",
          {
            method: "GET",
            headers: {
              // Ajoutez vos en-têtes nécessaires, par exemple, si vous avez un token d'authentification
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        if (response.ok) {
          const { reservations } = await response.json();
          setUserReservations(reservations);
        } else {
          console.error(
            "Erreur lors de la récupération des réservations de l'utilisateur."
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserReservations();
  }, []);

  return (
    <div className="bg-white">
      <main className="isolate">
        <div className="mt-32 sm:mt-40 xl:mx-auto xl:max-w-7xl xl:px-8">
          <div className="text-center py-8">
            <div className="mt-6">
              <div className="max-w-4xl mx-auto">
                <div className="md:col-span-2 bg-white shadow-lg rounded-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-800">
                    Réservation
                  </h2>
                  {userReservations.map((reservation) => (
                    <div
                      key={reservation.token}
                      className="flex flex-col lg:flex-row  justify-between items-center shadow-lg p-5 mb-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:flex-grow sm:items-center space-x-0 sm:space-x-20 space-y-2 sm:space-y-0">
                        <h4 className="text-xl font-semibold flex-shrink-0">
                          {reservation.departure} {">"} {reservation.arrival}
                        </h4>
                        <p className="text-lg flex-shrink-0">
                          {moment(reservation.date).format("HH:mm")}
                        </p>
                        <p className="text-lg flex-shrink-0">
                          Prix: {reservation.price} €
                        </p>
                        {/* Ajout du temps restant avant le départ */}
                        <p className="text-lg flex-shrink-0">
                          Départ dans:{" "}
                          {(() => {
                            const now = moment();
                            const departure = moment(reservation.date);
                            if (departure.isAfter(now)) {
                              const duration = moment.duration(
                                departure.diff(now)
                              );
                              const hours = duration.hours();
                              return `${hours} heures`;
                            } else {
                              return "Départ passé";
                            }
                          })()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-center items-center mt-8 p-4 bg-gray-100">
                    <p className="text-xl text-center">
                      Profitez pleinement de votre voyage.
                    </p>
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
