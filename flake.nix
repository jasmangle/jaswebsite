{
  description = "a desperate attempt to get my website repo working on nix";

  inputs = {
    nixpkgs.url = "nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
    nix-filter.url = "github:numtide/nix-filter";
  };

  outputs = { self, nixpkgs, flake-utils, nix-filter }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [
          (final: prev: {
            ruby = pkgs.ruby_3_3;
          })
        ];
        pkgs = import nixpkgs { inherit overlays system; };

        rubyEnv = pkgs.bundlerEnv {
          # The full app environment with dependencies
          name = "jaswebsite-env";
          inherit (pkgs) ruby;
          gemdir = ./.; # Points to Gemfile.lock and gemset.nix
        };

        updateDeps = pkgs.writeScriptBin "update-deps" (builtins.readFile
          (pkgs.replaceVars ./scripts/update.sh {
            shell = "${pkgs.bash}/bin/bash";
            bundix = "${pkgs.bundix}/bin/bundix";
            bundler = "${rubyEnv.bundler}/bin/bundler";
          })
        );
      in
      {
        #apps.default = {
        #  type = "app";
        #  program = "${rubyEnv}/bin/rails";
        #};

        devShells = rec {
          default = run;

          run = pkgs.mkShell {
            buildInputs = [ rubyEnv rubyEnv.wrappedRuby updateDeps ];

            #shellHook = ''
            #  ${rubyEnv}/bin/rails --version
            #'';
          };
        };

      });
}
