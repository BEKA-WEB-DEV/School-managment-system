export const generateUserId = (role) => {
    const prefix = role.toUpperCase().substring(0, 3); // 3 chars (e.g., "ADM")
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // 3-digit random number
    return `${prefix}-${timestamp}-${random}`; // Total length: 3 + 1 + 6 + 1 + 3 = 14 chars
  };

  //Example Outputs:

// ADM-123456-789

// TCH-987654-321

// STU-456789-123