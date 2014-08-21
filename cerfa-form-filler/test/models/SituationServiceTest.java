package models;

import static org.junit.Assert.assertEquals;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import models.Ressource.RessourcePeriode;
import models.Ressource.RessourceType;

import org.junit.Test;

public class SituationServiceTest {

    private static SituationService service = new SituationService();

    @Test
    public void testSumRessourcesOfType_NoIndividus_ReturnsZero() {
        // given
        List<Individu> individus = new ArrayList<>();

        // when
        int sum1 = service.sumRessourcesOfType(individus, RessourcePeriode.MOIS_1, RessourceType.values());
        int sum2 = service.sumRessourcesOfType(individus, RessourcePeriode.MOIS_2, RessourceType.values());
        int sum3 = service.sumRessourcesOfType(individus, RessourcePeriode.MOIS_3, RessourceType.values());

        // then
        assertEquals(0, sum1);
        assertEquals(0, sum2);
        assertEquals(0, sum3);
    }

    @Test
    public void testSumRessourcesOfType_NoRessourceTypes_ReturnsZero() {
        // given
        Individu individu = new Individu();
        individu.ressources = Arrays.asList(
                createRessource(RessourcePeriode.MOIS_1, RessourceType.REVENUS_SALARIES),
                createRessource(RessourcePeriode.MOIS_2, RessourceType.REVENUS_SALARIES),
                createRessource(RessourcePeriode.MOIS_3, RessourceType.REVENUS_SALARIES)
                );
        List<Individu> individus = Arrays.asList(individu);

        // when
        int sum1 = service.sumRessourcesOfType(individus, RessourcePeriode.MOIS_1);
        int sum2 = service.sumRessourcesOfType(individus, RessourcePeriode.MOIS_2);
        int sum3 = service.sumRessourcesOfType(individus, RessourcePeriode.MOIS_3);

        // then
        assertEquals(0, sum1);
        assertEquals(0, sum2);
        assertEquals(0, sum3);
    }

    @Test
    public void testSumRessourceOfType_TwoRessourcesInPeriod_ReturnsRessourcesSum() {
        // given
        Ressource ressource = new Ressource();
        ressource.montant = 150;
        ressource.periode = RessourcePeriode.MOIS_1;
        ressource.type = RessourceType.REVENUS_SALARIES;
        Ressource ressource2 = new Ressource();
        ressource2.montant = 100;
        ressource2.periode = RessourcePeriode.MOIS_1;
        ressource2.type = RessourceType.REVENUS_SALARIES;
        Individu individu = new Individu();
        individu.ressources = Arrays.asList(ressource, ressource2);

        // when
        int sum = service.sumRessourcesOfType(Arrays.asList(individu), RessourcePeriode.MOIS_1, RessourceType.REVENUS_SALARIES);

        // then
        assertEquals(250, sum);
    }

    @Test
    public void testSumRessourceOfType_OneRessourceNotInPeriod_DoesNotCountInSum() {
        // given
        Ressource ressource = new Ressource();
        ressource.montant = 150;
        ressource.periode = RessourcePeriode.MOIS_1;
        ressource.type = RessourceType.REVENUS_SALARIES;
        Ressource ressource2 = new Ressource();
        ressource2.montant = 100;
        ressource2.periode = RessourcePeriode.MOIS_2;
        ressource2.type = RessourceType.REVENUS_SALARIES;
        Individu individu = new Individu();
        individu.ressources = Arrays.asList(ressource, ressource2);

        // when
        int sum = service.sumRessourcesOfType(Arrays.asList(individu), RessourcePeriode.MOIS_1, RessourceType.REVENUS_SALARIES);

        // then
        assertEquals(150, sum);
    }

    @Test
    public void testSumRessourceOfType_BadRessourceType_DoesNotCountInSum() {
        // given
        Ressource ressource = new Ressource();
        ressource.montant = 150;
        ressource.periode = RessourcePeriode.MOIS_1;
        ressource.type = RessourceType.ALLOCATION_LOGEMENT;
        Ressource ressource2 = new Ressource();
        ressource2.montant = 100;
        ressource2.periode = RessourcePeriode.MOIS_1;
        ressource2.type = RessourceType.REVENUS_SALARIES;
        Individu individu = new Individu();
        individu.ressources = Arrays.asList(ressource, ressource2);

        // when
        int sum = service.sumRessourcesOfType(Arrays.asList(individu), RessourcePeriode.MOIS_1, RessourceType.REVENUS_SALARIES);

        // then
        assertEquals(100, sum);
    }

    @Test
    public void testSumRessourceOfType_TwoIndividus() {
        // given
        Ressource ressource = new Ressource();
        ressource.montant = 150;
        ressource.periode = RessourcePeriode.MOIS_1;
        ressource.type = RessourceType.REVENUS_SALARIES;
        Individu individu = new Individu();
        individu.ressources = Arrays.asList(ressource);
        Ressource ressource2 = new Ressource();
        ressource2.montant = 100;
        ressource2.periode = RessourcePeriode.MOIS_1;
        ressource2.type = RessourceType.REVENUS_SALARIES;
        Individu individu2 = new Individu();
        individu2.ressources = Arrays.asList(ressource2);

        // when
        int sum = service.sumRessourcesOfType(Arrays.asList(individu, individu2), RessourcePeriode.MOIS_1, RessourceType.REVENUS_SALARIES);

        // then
        assertEquals(250, sum);
    }

    private Ressource createRessource(RessourcePeriode periode, RessourceType type) {
        Ressource ressource = new Ressource();
        ressource.montant = 9999;
        ressource.periode = periode;
        ressource.type = type;

        return ressource;
    }
}
