import QRScanner from "../components/QRScanner";

export const ScannerPage = () => {
  return <section className="flex flex-col items-center justify-between h-full">
    <h1>Сканер QR-кода</h1>
    <QRScanner />
  </section>;
};