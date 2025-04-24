import { ThermalPrinter, PrinterTypes } from 'node-thermal-printer';

const printer = new ThermalPrinter({
  type: PrinterTypes.EPSON,
  interface: '\\\\localhost\\Printer69',
  characterSet: 'SLOVENIA',
  removeSpecialCharacters: false,
  lineCharacter: '-',
});

printer.alignCenter();
printer.println('Lukas Stinkt!!!!!');
printer.drawLine();
printer.cut();

await printer
  .execute()
  .then(success => {
    console.log('Druck erfolgreich:', success);
  })
  .catch(err => {
    console.error('Fehler beim Druck:', err);
  });
