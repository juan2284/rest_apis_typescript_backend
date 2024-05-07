import { connectDB } from '../server';
import db from '../config/db';

// Crear el Mock
jest.mock('../config/db');

describe('ConnectDB', () => {

  it('Should handle database connection error.', async () => {
    jest.spyOn(db, 'authenticate')
      .mockRejectedValueOnce(new Error('Hubo un error al conectar la Base de Datos.'));
    const consoleSpy = jest.spyOn(console, 'log');

    await connectDB();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Hubo un error al conectar la Base de Datos.')
    );
  });

});