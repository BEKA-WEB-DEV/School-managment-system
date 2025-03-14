import InstallService from '../services/installService.js';

export const installDatabase = async (req, res) => {
  try {
    const result = await InstallService.executeInstallQueries();
    res.json(result);
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message
    });
  }
};