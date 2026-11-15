// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import { FLASHCARDS } from '../data';

describe('End-to-End UI Integration Flows (<App />)', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    window.localStorage.clear();
    window.scrollTo = vi.fn();
    document.documentElement.classList.remove('dark');
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    consoleErrorSpy.mockRestore();
  });

  it('navigates Dashboard -> Studijní okruhy, expands chapters, and marks module completed', () => {
    render(<App />);

    expect(screen.getByText(/Připravenost ke zkoušce/i)).toBeInTheDocument();
    expect(screen.getByText(/Všech 8 studijních okruhů kurzu/i)).toBeInTheDocument();

    // Navigate to Studijní okruhy via sidebar
    fireEvent.click(screen.getByRole('button', { name: /Studijní okruhy \(8\)/i }));
    expect(screen.getByText(/Studijní okruhy kurzu/i)).toBeInTheDocument();

    // Expand all chapters
    fireEvent.click(screen.getByRole('button', { name: /Rozbalit všechny kapitoly/i }));
    expect(screen.getByText(/1\.5 Kvalifikace a povinnosti/i)).toBeInTheDocument();

    // Mark as completed
    fireEvent.click(screen.getByRole('button', { name: /Označit jako prostudované/i }));
    expect(screen.getByRole('button', { name: /Okruh prostudován ✓/i })).toBeInTheDocument();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('flips Flashcards, updates mastery badge, and advances cleanly without skipping cards', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: new RegExp(`Kartičky \\(${FLASHCARDS.length}\\)`, 'i') }));
    expect(screen.getByText(FLASHCARDS[0].question)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`Kartička 1 z ${FLASHCARDS.length}`, 'i'))).toBeInTheDocument();

    // Flip card
    fireEvent.click(screen.getByRole('button', { name: /Otočit kartičku/i }));
    // Rate card 1 as mastered
    fireEvent.click(screen.getByRole('button', { name: /3 · Umím skvěle/i }));

    // Verify badge updated and exact next card (index 1) is now displayed without skipping
    expect(screen.getByText(/Umím: 1/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`Kartička 2 z ${FLASHCARDS.length}`, 'i'))).toBeInTheDocument();
    expect(screen.getByText(FLASHCARDS[1].question)).toBeInTheDocument();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('runs Practice Quiz with immediate explanation and Zkouška nanečisto (25 questions)', () => {
    render(<App />);

    // Quick10 from Dashboard
    fireEvent.click(screen.getByRole('button', { name: /Rychlá 10min dávka/i }));
    expect(screen.getByText(/Otázka 1 z 10/i)).toBeInTheDocument();

    // Click option A (button starting with A)
    const optionA = screen.getByRole('button', { name: /^A\s/i });
    fireEvent.click(optionA);
    expect(
      screen.getByText(/Správně!|Pozor, tady byl chyták!/i)
    ).toBeInTheDocument();

    // Switch to Zkouška nanečisto
    fireEvent.click(screen.getByRole('button', { name: /Zkouška nanečisto.*25 otázek/i }));
    expect(screen.getByText(/Zodpovězeno: 0 \/ 25/i)).toBeInTheDocument();

    // Select an answer and submit exam
    fireEvent.click(screen.getByRole('button', { name: /^A\s/i }));
    expect(screen.getByText(/Zodpovězeno: 1 \/ 25/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Odevzdat a vyhodnotit zkoušku/i }));
    expect(screen.getByText(/Zbývá 24 nezodpovězených otázek/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Potvrdit odevzdání/i }));
    expect(screen.getByText(/\/ 25 bodů/i)).toBeInTheDocument();
    expect(screen.getByText(/Výsledek podle okruhů/i)).toBeInTheDocument();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('solves Modelová situace and expands oral exam answer structure', () => {
    render(<App />);

    fireEvent.click(screen.getAllByRole('button', { name: /Modelové situace/i })[0]);
    expect(screen.getByText(/Modelové situace k ústní zkoušce/i)).toBeInTheDocument();

    // Choose best answer in first scenario (validation choice 'b')
    fireEvent.click(screen.getByRole('button', { name: /Přistoupím čelem v úrovni očí/i }));
    expect(screen.getByText(/✓ Výborná volba v přímé péči/i)).toBeInTheDocument();

    // Expand oral exam model answer
    const oralButtons = screen.getAllByRole('button', { name: /Jak odpovědět u ústní zkoušky/i });
    fireEvent.click(oralButtons[0]);
    expect(screen.getByText(/Doporučená struktura odpovědi před komisí/i)).toBeInTheDocument();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('exercises Tools: Decubitus SVG map, Norton scale, 2026 Care Allowance & 15% rule calculator', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Pomůcky & Kalkulačky/i }));
    expect(screen.getByText(/Interaktivní mapa predilekčních míst dekubitů/i)).toBeInTheDocument();

    // Switch body position to Na boku and Vsedě
    fireEvent.click(screen.getByRole('button', { name: /^Na boku$/i }));
    expect(screen.getByText(/Velký chocholík stehenní kosti/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^Vsedě \(vozík\)$/i }));
    expect(screen.getByText(/Sedací hrboly \(ischia\) a kostrč/i)).toBeInTheDocument();

    // Adjust Norton score dropdown to drop score into high risk
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: '1' } });
    fireEvent.change(selects[1], { target: { value: '1' } });
    expect(screen.getByText(/Vysoké riziko vzniku dekubitů/i)).toBeInTheDocument();

    // Switch to Příspěvek na péči & Úhrady 2026 tab
    fireEvent.click(screen.getByRole('button', { name: /Příspěvek na péči & Úhrady 2026/i }));
    expect(screen.getByText(/II\. stupeň – středně těžká závislost/i)).toBeInTheDocument();

    // Change monthly pension input to 10000 and verify 15% remainder (1 500 Kč) & reduced payment (8 500 Kč)
    const pensionInput = screen.getByLabelText(/Měsíční důchod klienta/i);
    fireEvent.change(pensionInput, { target: { value: '10000' } });
    expect(screen.getByText(/Sníženo zákonem – důchod nestačí/i)).toBeInTheDocument();
    expect(screen.getByText(/8\s*500 Kč/i)).toBeInTheDocument();
    expect(screen.getAllByText(/1\s*500 Kč/i).length).toBeGreaterThanOrEqual(1);

    // Switch to Tab 4: SOS První pomoc & KPR
    fireEvent.click(screen.getByRole('button', { name: /SOS První pomoc & KPR/i }));
    expect(screen.getByText(/Nácvikový metronom 110 úderů\/min/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Face \(Obličej\)/i }));
    expect(screen.getByText(/Stačí JEDINÝ příznak: okamžitě volejte 155/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Spustit metronom KPR/i }));
    expect(screen.getByText(/Stlačení 1 \/ 30/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Zastavit metronom KPR/i }));
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('personalizes greeting & exam countdown and runs Oral Exam Ticket simulator', () => {
    render(<App />);

    // Customize profile greeting and target exam date
    fireEvent.click(screen.getByRole('button', { name: /Nastavit oslovení a termín zkoušky/i }));
    fireEvent.change(screen.getByLabelText(/Jak ti má appka říkat\?/i), {
      target: { value: 'Terko' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Uložit cíl/i }));
    expect(screen.getByText(/Ahoj Terko! Dáme opáčko ke zkoušce v klidu a přehledně\./i)).toBeInTheDocument();

    // Navigate to Oral Exam Simulator
    fireEvent.click(screen.getAllByRole('button', { name: /Modelové situace/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: /Trenažér ústní zkoušky \(Losování\)/i }));
    expect(screen.getByText(/Vylosovaný zkušební lístek/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Moje poznámky z potítka/i), {
      target: { value: 'Zmínit § 89 a hned informovat sestru' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Odkrýt, co chce slyšet komise/i }));
    expect(screen.getByText(/Co chce komise slyšet k okruhu & chytáky/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Umím – započítat lístek/i }));
    expect(screen.getByText(/Ústní lístky: 1/i)).toBeInTheDocument();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('supports Flashcards reverse mode and Glossary active recall mode', () => {
    render(<App />);

    // Flashcards reverse mode
    fireEvent.click(screen.getByRole('button', { name: new RegExp(`Kartičky \\(${FLASHCARDS.length}\\)`, 'i') }));
    fireEvent.click(screen.getByRole('button', { name: /Obrátit otázku ↔ odpověď/i }));
    expect(screen.getByRole('button', { name: /Obrácený režim ✓/i })).toBeInTheDocument();
    expect(screen.getByText(FLASHCARDS[0].answer)).toBeInTheDocument();

    // Glossary active recall mode
    fireEvent.click(screen.getByRole('button', { name: /Slovník pojmů/i }));
    fireEvent.click(screen.getByRole('button', { name: /Režim zkoušení \(skrýt definice\)/i }));
    const revealButtons = screen.getAllByRole('button', {
      name: /Zkuste pojem vysvětlit nahlas → kliknutím zobrazíte definici/i,
    });
    expect(revealButtons.length).toBeGreaterThan(10);
    fireEvent.click(revealButtons[0]);
    expect(screen.getAllByRole('button', {
      name: /Zkuste pojem vysvětlit nahlas → kliknutím zobrazíte definici/i,
    }).length).toBe(revealButtons.length - 1);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('searches Glossary without diacritics, opens Tahák, and toggles Dark Mode', () => {
    render(<App />);

    // Glossary search without diacritics
    fireEvent.click(screen.getByRole('button', { name: /Slovník pojmů/i }));
    const searchInput = screen.getByLabelText(/Hledat ve slovníku pojmů/i);
    fireEvent.change(searchInput, { target: { value: 'afazie' } });
    expect(screen.getByRole('heading', { name: 'Afázie' })).toBeInTheDocument();

    // Cheat sheet
    fireEvent.click(screen.getByRole('button', { name: /Tahák ke zkoušce/i }));
    expect(screen.getByRole('button', { name: /Vytisknout tahák \/ Uložit do PDF/i })).toBeInTheDocument();

    // Dark mode toggle
    fireEvent.click(screen.getByRole('button', { name: /Přepnout světlý a tmavý režim/i }));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('shows PWA install button on beforeinstallprompt and calls prompt() on click', async () => {
    render(<App />);

    expect(screen.queryByRole('button', { name: /Nainstalovat aplikaci/i })).not.toBeInTheDocument();

    const promptMock = vi.fn().mockResolvedValue(undefined);
    const installEvent = new Event('beforeinstallprompt', { cancelable: true }) as Event & {
      prompt: () => Promise<void>;
      userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
    };
    installEvent.prompt = promptMock;
    installEvent.userChoice = Promise.resolve({ outcome: 'accepted' });

    fireEvent(window, installEvent);

    const installButtons = screen.getAllByRole('button', { name: /Nainstalovat aplikaci/i });
    expect(installButtons.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(installButtons[0]);
    expect(promptMock).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Nainstalovat aplikaci/i })).not.toBeInTheDocument();
    });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
