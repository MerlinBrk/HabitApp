import React, { type ReactNode } from 'react';
import { FaPenSquare } from 'react-icons/fa';
import { IoMdEye } from 'react-icons/io';
import { IoPhonePortraitOutline } from 'react-icons/io5';
import { MdIosShare, MdOutlineAddBox } from "react-icons/md";

type SafariStep = {
    icon: ReactNode | string;
    alt: string;
    text: ReactNode;
};

const safariSteps: SafariStep[] = [
    {
        icon: <MdIosShare className="w-6 h-6 text-indigo-600" style={{ margin: 'auto' }} />,
        alt: "Teilen",
        text: <>Öffne das <b>Teilen-Menü</b> <span className="text-xs text-gray-400">(Quadrat mit Pfeil nach oben)</span></>,
    },
    {
        icon: <MdOutlineAddBox className="w-6 h-6 text-indigo-600" style={{ margin: 'auto' }} />,
        alt: "Zum Home-Bildschirm",
        text: <>Wähle <b>„Zum Home-Bildschirm hinzufügen“</b></>,
    },
    {
        icon: <FaPenSquare className="w-5 h-5 text-indigo-600" style={{ margin: 'auto' }} />,
        alt: "Name",
        text: <>Gib der App einen Namen und tippe auf <b>„Hinzufügen“</b></>,
    },
    {
        icon: <IoPhonePortraitOutline className="w-5 h-5 text-indigo-600" style={{ margin: 'auto' }} />,
        alt: "Home",
        text: <>Die App erscheint auf deinem <b>Home-Bildschirm</b> und kann wie eine native App genutzt werden.</>,
    },
];

const AppNotInstalled: React.FC = () => {
  const browser = (() => {
    const userAgent = navigator.userAgent;
    if (/chrome|crios|crmo/i.test(userAgent) && !/edge|edg|opr|opera/i.test(userAgent)) return "Chrome";
    if (/firefox|fxios/i.test(userAgent)) return "Firefox";
    if (/safari/i.test(userAgent) && !/chrome|crios|crmo/i.test(userAgent)) return "Safari";
    if (/edg/i.test(userAgent)) return "Edge";
    if (/opr|opera/i.test(userAgent)) return "Opera";
    return "Unknown";
  })();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 min-h-screen">
      <div className="backdrop-blur-lg bg-white/70 border border-indigo-200 shadow-2xl rounded-3xl p-8 max-w-lg w-full animate-fade-in">
        <div className="flex flex-col items-center gap-2">
          <img
            src="https://img.icons8.com/ios-filled/100/4f46e5/rocket--v1.png"
            alt="App Icon"
            className="w-16 h-16 mb-2 animate-bounce"
          />
          <h2 className="text-3xl font-extrabold text-indigo-700 mb-2 drop-shadow">App nicht installiert</h2>
          <p className="text-gray-700 mb-6">
            Installiere die App, um das beste Erlebnis zu erhalten.<br />
            Folge der Anleitung für dein Gerät:
          </p>
        </div>

        {browser === "Safari" && (
          <div className="mt-6">
            <ol className="space-y-4 mb-8">
              {safariSteps.map((step, idx) => (
            <li
              key={idx}
              className="flex items-center gap-5 group py-3 px-2 rounded-xl hover:bg-indigo-50 transition-all"
            >
              <span className="relative flex items-center justify-center">
                {typeof step.icon === "string" ? (
                  <img
                src={step.icon}
                alt={step.alt}
                className="w-10 h-10 bg-indigo-100 rounded-full shadow animate-pop"
                style={{ animationDelay: `${idx * 0.15}s` }}
                  />
                ) : (
                  <span
                className="bg-indigo-100 rounded-full shadow animate-pop flex items-center justify-center w-10 h-10"
                style={{ animationDelay: `${idx * 0.15}s` }}
                aria-label={step.alt}
                  >
                {step.icon}
                  </span>
                )}
                <span
                  className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-400 animate-pulse"
                  style={{ display: idx === safariSteps.length - 1 ? 'none' : 'block' }}
                />
              </span>
              <span className="text-gray-800 text-base leading-relaxed">{step.text}</span>
            </li>
              ))}
            </ol>
            <div className="flex items-center gap-3 mt-10 text-indigo-700 font-medium">


              <IoMdEye className="w-7 h-7 animate-tap"/>

              <span className="text-lg">Starte die App über das neue Icon auf deinem Home-Bildschirm!</span>
            </div>
          </div>
        )}

        {browser === "Chrome" && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="https://img.icons8.com/ios-filled/50/4f46e5/chrome--v1.png"
                alt="Chrome Icon"
                className="w-8 h-8"
              />
              <span className="font-semibold text-indigo-600">Chrome (Android)</span>
            </div>
            <ol className="space-y-0.5">
              <li className="flex items-center gap-3">
                <img src="https://img.icons8.com/ios-filled/24/4f46e5/menu.png" alt="Menü" className="w-8 h-8 bg-indigo-100 rounded-full shadow" />
                <span>Tippe auf das <b>Menü</b> (drei Punkte oben rechts).</span>
              </li>
              <li className="flex items-center gap-3">
                <img src="https://img.icons8.com/ios-filled/24/4f46e5/add-to-home-screen.png" alt="Zum Home-Bildschirm" className="w-8 h-8 bg-indigo-100 rounded-full shadow" />
                <span>Wähle <b>„Zum Startbildschirm hinzufügen“</b>.</span>
              </li>
            </ol>
          </div>
        )}
      </div>
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97);}
          to { opacity: 1; transform: scale(1);}
        }
        .animate-pop {
          animation: popIn 0.4s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.7);}
          80% { opacity: 1; transform: scale(1.08);}
          100% { opacity: 1; transform: scale(1);}
        }
        .animate-tap {
          animation: tap 1.2s infinite;
        }
        @keyframes tap {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-6px);}
        }
      `}</style>
    </div>
  );
};

export default AppNotInstalled;
