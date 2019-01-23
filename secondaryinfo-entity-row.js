var LitElement = LitElement || Object.getPrototypeOf(customElements.get('hui-error-entity-row'));

class SecondaryInfoEntityRow extends LitElement {

  render() {
    return window.cardTools.litHtml`
        ${this._wrappedElement}
    `;
  }

  firstUpdated() {
    this._updateElement(this._wrappedElement, this._hass);
  }

  setConfig(config) {
    if(!window.cardTools) throw new Error(`Can't find card-tools. See https://github.com/thomasloven/lovelace-card-tools`);
    window.cardTools.checkVersion(0.1);
    this._config = config;
    this._wrappedElement = this._createElement(config);
    this.requestUpdate();
  }

  set hass(hass) {
    this._hass = hass;
    this._stateObj = this._config.entity in hass.states ? hass.states[this._config.entity] : null;
    this._updateElement(this._wrappedElement, hass);
  }

  _createElement(config) {
    // Override the custom row type in order to create the 'standard' row for this entity
    let defaultRowConfig = Object.assign(config, {type: "default"});
    const element = window.cardTools.createEntityRow(defaultRowConfig);
    return element;
  }

  async _updateElement(wrappedElement, hass) {
    if (!wrappedElement) return;

    this._wrappedElement.hass = hass;
    await this._wrappedElement.updateComplete;
    let secondaryInfoDiv = this._wrappedElement.shadowRoot.querySelector("hui-generic-entity-row").shadowRoot.querySelector(".secondary");
    if (secondaryInfoDiv && this._config.secondary_info) {
      let text = window.cardTools.parseTemplate(this._config.secondary_info, 'Unable to parse secondary_info config');
      secondaryInfoDiv.innerHTML = text;
    }
  }

}

customElements.define('secondaryinfo-entity-row', SecondaryInfoEntityRow);