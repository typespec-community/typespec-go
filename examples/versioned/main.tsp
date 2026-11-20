import "@typespec-community/typespec-go";

using TypeSpec.Go;

/**
 * Versioned API: Petstore.V1 and Petstore.V2 are separate namespaces that
 * each map to their own Go package via @go.pkg (@pkg). V2 evolves the
 * discriminated Pet union with a new variant (Lizard) and adds a field to
 * Shelter — the two package-local Pet implementations must stay independent.
 */

@pkg("github.com/acme/pets/api")
namespace Petstore.V1 {
  enum PetKind {
    dog: "dog",
    cat: "cat",
  }

  model Dog {
    kind: PetKind;
    name: string;
    barkLevel: int32;
  }

  model Cat {
    kind: PetKind;
    name: string;
    meowPitch: float64;
  }

  union Pet {
    dog: Dog,
    cat: Cat,
  }

  model Shelter {
    id: string;
    residents: Pet[];
  }
}

@pkg("github.com/acme/pets/api")
namespace Petstore.V2 {
  enum PetKind {
    dog: "dog",
    cat: "cat",
    lizard: "lizard",
  }

  model Dog {
    kind: PetKind;
    name: string;
    barkLevel: int32;
  }

  model Cat {
    kind: PetKind;
    name: string;
    meowPitch: float64;
  }

  model Lizard {
    kind: PetKind;
    name: string;
    tailLength: float64;
  }

  union Pet {
    dog: Dog,
    cat: Cat,
    lizard: Lizard,
  }

  model Shelter {
    id: string;
    residents: Pet[];
    capacity: int32;
  }
}
