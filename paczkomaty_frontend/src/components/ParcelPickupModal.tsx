import React from "react";
import { useState } from "react";
import { QRCodeSVG } from 'qrcode.react';

export const ParcelPickupModal = ({ trackingNumber, onClose }: { trackingNumber: string, onClose: () => void }) => {
  // Possible pickup methods
  type PickupMethod = "select" | "qr" | "code" | "locker";
  const [pickupMethod, setPickupMethod] = useState<PickupMethod>("select");
  const [pickupCode, setPickupCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [receivedPickupCode, setReceivedPickupCode] = useState<string | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [qrThankYou, setQrThankYou] = useState(false);

  const handleShowPickupCode = async () => {
    setIsLoading(true);
    setMessage(null);
    setReceivedPickupCode(null);
    try {
      // 1. Pobierz kod odbioru (wysyłamy POST)
      const codeRes = await fetch(`http://localhost:8000/api/get_pickup_code/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tracking_number: trackingNumber })
      });
      const codeData = await codeRes.json();
      if (!codeRes.ok || !codeData.pickup_code) {
        setMessage(codeData.detail || "Nie udało się pobrać kodu odbioru");
        setIsLoading(false);
        return;
      }
      setReceivedPickupCode(codeData.pickup_code);
      // 2. Wyświetl kod odbioru przez 5 sekund
      setTimeout(async () => {
        // 3. Zmieniamy status paczki na 'delivered' (wysyłamy PUT)
        const updateRes = await fetch(`http://localhost:8000/api/update_status/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ tracking_number: trackingNumber, status: 'delivered' })
        });
        const updateData = await updateRes.json();
        if (!updateRes.ok) {
          setMessage(updateData.detail || "Nie udało się zaktualizować statusu paczki");
          setIsLoading(false);
          return;
        }
        // 4. Po kolejnych 5 sekundach wyświetl podziękowanie z animacją i zamknij modal
        setShowThankYou(true);
        setIsLoading(false);
        setMessage(null);
        setTimeout(() => {
          setShowThankYou(false);
          onClose();
        }, 5000);
      }, 5000);
    } catch (error) {
      console.error("Błąd:", error);
      setMessage("Błąd połączenia z serwerem");
      setIsLoading(false);
    }
  };

  const handlePickupByQR = async () => {
    setIsLoading(true);
    setMessage(null);
    // Simulate QR scanning - in a real app, you would integrate with a camera API
    setTimeout(() => {
      setQrScanned(true);
      try {
        // Here you would normally send the QR data to the server
        setMessage("Kod QR zeskanowany pomyślnie! Paczka została odebrana.");
      } catch (err) {
        setMessage("Błąd podczas odczytu kodu QR");
      } finally {
        setIsLoading(false);
      }
    }, 2000);
  };

  const handleOpenLocker = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`http://localhost:8000/api/parcels/open_locker/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tracking_number: trackingNumber })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Skrytka została otwarta! Możesz odebrać paczkę.");
      } else {
        setMessage(data.detail || "Błąd otwierania skrytki");
      }
    } catch (err) {
      setMessage("Błąd połączenia z serwerem");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQRCode = () => {
    setShowQRCode(true);
    setQrGenerated(true);
    // Po 5 sekundach wyślij PUT do update_status i pokaż animację
    setTimeout(async () => {
      try {
        const updateRes = await fetch(`http://localhost:8000/api/update_status/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ tracking_number: trackingNumber, status: 'delivered' })
        });
        const updateData = await updateRes.json();
        if (!updateRes.ok) {
          setMessage(updateData.detail || "Nie udało się zaktualizować statusu paczki");
          setIsLoading(false);
          return;
        }
        setQrThankYou(true);
        setTimeout(() => {
          setQrThankYou(false);
          setShowQRCode(false);
          setQrGenerated(false);
          onClose();
        }, 5000);
      } catch {
        setMessage("Błąd połączenia z serwerem");
        setIsLoading(false);
      }
    }, 5000);
  };

  // Funkcja do obsługi zdalnego otwierania skrytki
  const handleOpenLockerRemote = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      // 1. Zmieniamy status paczki na 'delivered' (wysyłamy PUT)
      const updateRes = await fetch(`http://localhost:8000/api/update_status/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tracking_number: trackingNumber, status: 'delivered' })
      });
      const updateData = await updateRes.json();
      if (!updateRes.ok) {
        setMessage(updateData.detail || "Nie udało się zaktualizować statusu paczki");
        setIsLoading(false);
        return;
      }
      // 2. Po 5 sekundach wyświetl podziękowanie z animacją i zamknij modal
      setTimeout(() => {
        setShowThankYou(true);
        setIsLoading(false);
        setMessage(null);
        setTimeout(() => {
          setShowThankYou(false);
          onClose();
        }, 5000);
      }, 5000);
    } catch (error) {
      setMessage("Błąd połączenia z serwerem");
      setIsLoading(false);
    }
  };

  const renderPickupMethodSelection = () => {
    return (
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Wybierz metodę odbioru:</h4>
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => setPickupMethod("qr")}
            className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-xl mb-2">📷</div>
              <div className="font-medium">Zeskanuj kod QR</div>
            </div>
          </button>
          
          <button
            onClick={() => setPickupMethod("code")}
            className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-xl mb-2">🔢</div>
              <div className="font-medium">Wprowadź kod odbioru</div>
            </div>
          </button>
          
          <button
            onClick={() => setPickupMethod("locker")}
            className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-xl mb-2">🔓</div>
              <div className="font-medium">Otwórz skrytkę zdalnie</div>
            </div>
          </button>
        </div>
      </div>
    );
  };

  const renderQRScanner = () => {
    if (qrThankYou) {
      return (
        <div className="flex flex-col items-center justify-center py-10 animate-fade-in">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2 animate-fade-in">
            Dziękujemy za skorzystanie z naszych usług!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-center animate-fade-in">
            Paczka została odebrana pomyślnie.
          </p>
        </div>
      );
    }
    if (showQRCode) {
      return (
        <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center">
          <div className="mb-4">
            <QRCodeSVG value={trackingNumber} size={200} />
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
            Przyłóż ten kod QR do czytnika w paczkomacie
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Kod QR</h4>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center">
          {!qrScanned ? (
            <>
              <div className="w-48 h-48 bg-gray-100 dark:bg-gray-700 mb-4 rounded flex items-center justify-center">
                <div className="text-4xl">📷</div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Umieść kod QR w polu widzenia kamery
              </p>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-500 dark:text-green-200 text-2xl">✓</span>
              </div>
              <p className="font-medium text-green-600 dark:text-green-400">Zeskanowano pomyślnie!</p>
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <button 
            type="button" 
            onClick={() => {
              setShowQRCode(false);
              setPickupMethod("select");
            }}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Wróć
          </button>
          <div className="flex space-x-2">
            <button 
              onClick={handlePickupByQR}
              disabled={isLoading || qrScanned}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isLoading ? "Skanowanie..." : qrScanned ? "Zeskanowano" : "Skanuj"}
            </button>
            <button 
              onClick={handleGenerateQRCode}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              disabled={qrGenerated}
            >
              Generuj kod QR
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCodeInput = () => {
    if (showThankYou) {
      return (
        <div className="flex flex-col items-center justify-center py-10 animate-fade-in">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2 animate-fade-in">
            Dziękujemy za skorzystanie z naszych usług!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-center animate-fade-in">
            Paczka została odebrana pomyślnie.
          </p>
        </div>
      );
    }
    if (receivedPickupCode) {
      return (
        <div className="flex flex-col items-center justify-center py-10 animate-fade-in">
          <div className="text-center text-lg font-bold text-blue-700 dark:text-blue-300 mb-2 animate-fade-in">
            Kod odbioru: <span className="tracking-widest text-2xl">{receivedPickupCode}</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-4">Wpisz ten kod w paczkomacie, aby odebrać paczkę.</p>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              disabled={isLoading}
            >
              Zamknij
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center py-10 animate-fade-in">
        <button
          onClick={handleShowPickupCode}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-semibold disabled:bg-blue-300 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Pobieranie kodu..." : "Odbierz paczkę"}
        </button>
      </div>
    );
  };

  const renderLockerOpener = () => {
    if (showThankYou) {
      return (
        <div className="flex flex-col items-center justify-center py-10 animate-fade-in">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2 animate-fade-in">
            Dziękujemy za skorzystanie z naszych usług!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-center animate-fade-in">
            Paczka została odebrana pomyślnie.
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Otwieranie skrytki</h4>
        <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">🔓</span>
          </div>
          <p className="text-center text-gray-700 dark:text-gray-300">
            Naciśnij przycisk, aby otworzyć skrytkę z paczką #{trackingNumber}
          </p>
        </div>
        <div className="flex justify-between">
          <button 
            type="button" 
            onClick={() => setPickupMethod("select")}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            disabled={isLoading}
          >
            Wróć
          </button>
          <button 
            onClick={handleOpenLockerRemote}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "Otwieranie..." : "Otwórz skrytkę"}
          </button>
        </div>
      </div>
    );
  };

  const renderActiveContent = () => {
    switch (pickupMethod) {
      case "qr":
        return renderQRScanner();
      case "code":
        return renderCodeInput();
      case "locker":
        return renderLockerOpener();
      default:
        return renderPickupMethodSelection();
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(1,1,1,0.5)] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Odbiór paczki #{trackingNumber}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
          >
            ✕
          </button>
        </div>
        
        {message && (
          <div className={`text-center text-sm p-2 rounded mb-4 ${
            message.includes("Błąd") 
              ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200" 
              : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200"
          }`}>
            {message}
          </div>
        )}
        
        {renderActiveContent()}
      </div>
    </div>
  );
};