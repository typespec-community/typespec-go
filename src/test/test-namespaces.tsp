namespace Vendor.Service.API {
  model User {
    id: string;
    name: string;
    age?: uint8;
  }
  
  model Product {
    id: string;
    name: string;
    price: float64;
    available: boolean;
  }
}

namespace Utils {
  model Config {
    debug: boolean;
    timeout: duration;
    version: string;
  }
}