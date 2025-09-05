import QRScanner from "../components/QRScanner";

export const ScannerPage = () => {
  return <section className="flex flex-col items-center justify-between h-full">
    <h3>Сканер QR-кода</h3>
    <QRScanner />
  </section>;
};