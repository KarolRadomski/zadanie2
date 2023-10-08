import React, { useState, useEffect } from 'react';

function TagForm({ formValidity, tag, setFormData, formData, currentIngressRule }) {
  const [validity, setValidity] = useState({});
  const updateRule = (e) => {
    e.preventDefault();
    let { name, value } = e.target;

    switch (name) {
      case 'TagType':
        const ingressRuleObj = formData.INGRESS_RULES;
        let tagsObj = ingressRuleObj[currentIngressRule].MATCH_CRITERIA.TAGS;

        tagsObj = tagsObj.map((tagObject) => {
          if (tagObject.INDEX === tag.INDEX) {
            tagObject.TYPE = value;
          }
          return tagObject;
        });

        setFormData({ ...formData, INGRESS_RULES: formData.INGRESS_RULES.map((rule, index) => (index === currentIngressRule ? { ...rule, MATCH_CRITERIA: { ...rule.MATCH_CRITERIA, TAGS: tagsObj } } : rule)) });

        break;

      case 'vlanID':
        const ingressRuleObj2 = formData.INGRESS_RULES;
        let tagsObj2 = ingressRuleObj2[currentIngressRule].MATCH_CRITERIA.TAGS;

        tagsObj2 = tagsObj2.map((tagObject) => {
          if (tagObject.INDEX === tag.INDEX) {
            tagObject.VLAN_ID = value;
          }
          return tagObject;
        });
        setFormData({ ...formData, INGRESS_RULES: formData.INGRESS_RULES.map((rule, index) => (index === currentIngressRule ? { ...rule, MATCH_CRITERIA: { ...rule.MATCH_CRITERIA, TAGS: tagsObj2 } } : rule)) });
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (formValidity?.MATCH_CRITERIA?.TAGS?.length > 0) {
      setValidity(formValidity?.MATCH_CRITERIA?.TAGS[tag.INDEX]);
    }
  }, [formValidity, tag.INDEX]);
  return (
    <div className="row mb-4">
      <div className="form-group col-md-4">
        <label htmlFor="tagINDEX">Tag index:</label>
        <input className="form-control " id="tagINDEX" name="INDEX" value={tag.INDEX} disabled onChange={updateRule}></input>
      </div>
      <div className="form-group col-md-4">
        <label htmlFor="vlanType">Vlan type/ethertype:</label>
        <select className="form-control" id="vlanType" name="TagType" value={tag.TYPE} onChange={updateRule}>
          <option value="c-vlan">c-vlan</option>
          <option value="s-vlan">s-vlan</option>
        </select>
      </div>
      <div className="form-group col-md-4">
        <label htmlFor="vlanID">Vlan ID:</label>
        <input type="number" className={'form-control ' + validity?.VLAN_ID} id="vlanID" name="vlanID" value={tag.VLAN_ID} onChange={updateRule}></input>
        {validity?.vlan_IDError ? <div className="invalid-feedback">{validity?.vlan_IDError}</div> : null}
      </div>
    </div>
  );
}

export default TagForm;
