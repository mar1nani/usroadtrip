// Calcul du solde Tricount à 2 + carte commune neutre.
// La carte commune est un pot déjà divisé par construction : elle ne crée
// jamais de dette. Seules les dépenses "à partager" avancées personnellement
// (avec l'argent de Marouane ou d'Isabelle, pas la carte) déséquilibrent les
// comptes entre les deux — voir le plan pour le raisonnement complet.
export function computeExpenseBalance(expenses) {
  const sum = (filterFn) => expenses.filter(filterFn).reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);

  const sharedCardTotal = sum((e) => e.paidBy === "shared_card");
  const marouaneSharedFronte = sum((e) => e.paidBy === "marouane" && e.split === "shared");
  const isabelleSharedFronte = sum((e) => e.paidBy === "isabelle" && e.split === "shared");
  const marouanePersonnel = sum((e) => e.paidBy === "marouane" && e.split === "personal");
  const isabellePersonnel = sum((e) => e.paidBy === "isabelle" && e.split === "personal");

  const totalMarouane = marouaneSharedFronte + marouanePersonnel;
  const totalIsabelle = isabelleSharedFronte + isabellePersonnel;

  const diff = (marouaneSharedFronte - isabelleSharedFronte) / 2;

  let balance = { owedBy: null, owedTo: null, amount: 0 };
  if (Math.abs(diff) >= 0.01) {
    balance = diff > 0 ? { owedBy: "isabelle", owedTo: "marouane", amount: diff } : { owedBy: "marouane", owedTo: "isabelle", amount: -diff };
  }

  return {
    totalMarouane,
    totalIsabelle,
    sharedCardTotal,
    sharedCardEach: sharedCardTotal / 2,
    balance,
  };
}
