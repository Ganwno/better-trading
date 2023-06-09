// Vendor
import {expect} from 'chai';
import {setupTest} from 'ember-mocha';
import {default as window} from 'ember-window-mock';
import {beforeEach, afterEach, describe, it} from 'mocha';

// HTML Samples
import HundredChaosElement from 'better-trading/tests/html-samples/item-results/hundred-chaos';
import FlushDivineElement from 'better-trading/tests/html-samples/item-results/flush-divine';
import FractionDivineElement from 'better-trading/tests/html-samples/item-results/fraction-divine';

// Types
import EquivalentPricings from 'better-trading/services/item-results/enhancers/equivalent-pricings';
import ItemResult from 'better-trading/services/item-results/item-element';

describe('Unit | Services | ItemResults | Enhancers | EquivalentPricings', () => {
  setupTest();

  let service: EquivalentPricings;
  let itemElementService: ItemResult;
  let resultsContainer: HTMLDivElement;

  beforeEach(function () {
    service = this.owner.lookup('service:item-results/enhancers/equivalent-pricings');
    itemElementService = this.owner.lookup('service:item-results/item-element');

    service.chaosRatios = {
      'divine-orb': 150,
    };

    resultsContainer = window.document.createElement('div');
    resultsContainer.style.display = 'none';
    window.document.body.prepend(resultsContainer);
  });

  afterEach(() => {
    resultsContainer.remove();
  });

  describe('enhance', () => {
    it('should display the divine equivalence for valuable chaos items', () => {
      resultsContainer.insertAdjacentHTML('afterbegin', HundredChaosElement);
      const itemElement = resultsContainer.querySelector('div') as HTMLDivElement;
      const parsedItem = itemElementService.parseElement(itemElement);
      service.enhance(itemElement, parsedItem);

      const priceElement = resultsContainer.querySelector('.details .price') as HTMLDivElement;
      expect(priceElement.innerText.trim()).to.equal('Exact Price: 100×Chaos Orb=0.7×');
      expect(priceElement.innerHTML.trim()).to.equal(
        '<span data-field="price" class="s sorted sorted-asc"><span class="price-label fixed-price">Exact Price:</span><br> <span>100</span><span>×</span><span class="currency-text currency-image"><img src="https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png?v=c60aa876dd6bab31174df91b1da1b4f9" alt="chaos" title="chaos"><span>Chaos Orb</span></span></span><span class="bt-equivalent-pricings bt-equivalent-pricings-equivalent"><span><span class="bt-equivalent-pricings-equals">=</span>0.7×<img src="https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyModValues.png" alt="divine"></span></span>'
      );
    });

    it('should display the chaos equivalence for non-chaos items', () => {
      resultsContainer.insertAdjacentHTML('afterbegin', FlushDivineElement);
      const itemElement = resultsContainer.querySelector('div') as HTMLDivElement;
      const parsedItem = itemElementService.parseElement(itemElement);
      service.enhance(itemElement, parsedItem);

      const priceElement = resultsContainer.querySelector('.details .price') as HTMLDivElement;
      expect(priceElement.innerText.trim()).to.equal('Exact Price: 1×Divine Orb=150×');
      expect(priceElement.innerHTML.trim()).to.equal(
        '<span data-field="price" class="s sorted sorted-asc"><span class="price-label buyout-price">Exact Price:</span><br> <span>1</span><span>×</span><span class="currency-text currency-image"><img src="https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyAddModToRare.png?v=1745ebafbd533b6f91bccf588ab5efc5" alt="exa" title="exa"><span>Divine Orb</span></span></span><span class="bt-equivalent-pricings bt-equivalent-pricings-equivalent"><span><span class="bt-equivalent-pricings-equals">=</span>150×<img src="https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png" alt="chaos"></span></span>'
      );
    });

    it('should also display the non-chaos fraction if the result is not flush', () => {
      resultsContainer.insertAdjacentHTML('afterbegin', FractionDivineElement);
      const itemElement = resultsContainer.querySelector('div') as HTMLDivElement;
      const parsedItem = itemElementService.parseElement(itemElement);
      service.enhance(itemElement, parsedItem);

      const priceElement = resultsContainer.querySelector('.details .price') as HTMLDivElement;
      expect(priceElement.innerText.trim()).to.equal('Exact Price: 1.1×Divine Orb=165×=1×+15×');
      expect(priceElement.innerHTML.trim()).to.equal(
        '<span data-field="price" class="s sorted sorted-asc"><span class="price-label fixed-price">Exact Price:</span><br> <span>1.1</span><span>×</span><span class="currency-text currency-image"><img src="https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyAddModToRare.png?v=1745ebafbd533b6f91bccf588ab5efc5" alt="exa" title="exa"><span>Divine Orb</span></span></span><span class="bt-equivalent-pricings bt-equivalent-pricings-equivalent"><span><span class="bt-equivalent-pricings-equals">=</span>165×<img src="https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png" alt="chaos"></span></span><span class="bt-equivalent-pricings bt-equivalent-pricings-chaos-fraction"><span><span class="bt-equivalent-pricings-equals">=</span>1×<img src="https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyAddModToRare.png?v=1745ebafbd533b6f91bccf588ab5efc5" alt="exa">+15×<img src="https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png" alt="chaos"></span></span>'
      );
    });
  });
});
