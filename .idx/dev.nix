{ pkgs, ... }: {
  # Let Nix manage packages
  packages = [ 
    pkgs.nodejs_21
    pkgs.watchman
    pkgs.gmp
  ];

  # Sets environment variables in the workspace
  env = {
    EXPO_USE_FAST_RESOLVER = "1";
  };

  idx = {
    # Aquí puedes añadir IDs de extensiones de VS Code si quieres que se instalen automáticamente
    extensions = [];

    workspace = {
      onCreate = {
        install-dependencies = "npm install";
      };
    };

    # Configuración de los entornos de previsualización
    previews = {
      enable = true;
      previews = {
        # Vista previa para Web
        web = {
          command = [ "npx" "expo" "start" "--web" "--port" "8082" ];
          manager = "web";
        };
        
        # Emulador de Android
        android = {
          command = [ "npx" "expo" "start" "--android" ];
          manager = "android";
        };
      };
    };
  };
}