package models;

import java.util.Arrays;
import java.util.Collection;

import models.Ressource.RessourcePeriode;
import models.Ressource.RessourceType;

import org.apache.commons.lang3.ArrayUtils;

public class SituationService {

    public int sumRessourcesOfType(Collection<Individu> individus, RessourcePeriode periode, RessourceType... resourceTypes) {
        int sum = 0;
        for (Individu individu : individus) {
            for (Ressource ressource : individu.ressources) {
                if (isRessourceInScope(ressource, periode, resourceTypes)) {
                    sum += ressource.montant;
                }
            }
        }

        return sum;
    }

    public int sumRessourcesOfType(Individu individu, RessourcePeriode periode, RessourceType... resourceTypes) {
        return sumRessourcesOfType(Arrays.asList(individu), periode, resourceTypes);
    }

    public int sumAllRessources(Individu individu, RessourcePeriode periode) {
        return sumRessourcesOfType(individu, periode, RessourceType.values());
    }

    public int sumAllRessources(Individu individu) {
        int result = 0;
        for (RessourcePeriode periode : RessourcePeriode.values()) {
            result += sumAllRessources(individu, periode);
        }

        return result;
    }

    private boolean isRessourceInScope(Ressource ressource, RessourcePeriode periode, RessourceType... resourceTypes) {
        if (ressource.periode == periode) {
            if (ArrayUtils.contains(resourceTypes, ressource.type)) {
                return true;
            }
        }

        return false;
    }
}
