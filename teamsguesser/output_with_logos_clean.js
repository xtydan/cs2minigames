import fs from "fs-extra";

const INPUT = "./output_with_logos.json";
const OUTPUT = "./output_with_logos_clean.json";

(async () => {
  const data = await fs.readJson(INPUT);

  // Iterujemy po każdym zawodniku i filtrujemy drużyny
  const cleaned = data.map(player => {
    return {
      ...player,
      teams: (player.teams || []).filter(team => team.team !== "Unknown")
    };
  });

  await fs.writeJson(OUTPUT, cleaned, { spaces: 2 });
  console.log(`✅ Gotowe! Plik zapisany jako ${OUTPUT}`);
})();
