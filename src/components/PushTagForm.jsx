import React, { useState, useEffect } from 'react';

function PushTagForm({ formValidity, tag, formData, setFormData, currentIngressRule }) {
  const [validity, setValidity] = useState(formValidity?.REWRITE?.PUSH_TAGS[tag.INDEX]);
  const updateRule = (e) => {
    e.preventDefault();
    let { name, value } = e.target;

    switch (name) {
      case 'TagType':
        const ingressRuleObj = formData.INGRESS_RULES;
        let tagsObj = ingressRuleObj[currentIngressRule].REWRITE.PUSH_TAGS;

        tagsObj = tagsObj.map((tagObject) => {
          if (tagObject.INDEX === tag.INDEX) {
            tagObject.TYPE = value;
          }
          return tagObject;
        });

        setFormData({ ...formData, INGRESS_RULES: formData.INGRESS_RULES.map((rule, index) => (index === currentIngressRule ? { ...rule, REWRITE: { ...rule.REWRITE, PUSH_TAGS: tagsObj } } : rule)) });

        break;

      case 'vlanID':
        const ingressRuleObj2 = formData.INGRESS_RULES;
        let tagsObj2 = ingressRuleObj2[currentIngressRule].REWRITE.PUSH_TAGS;

        tagsObj2 = tagsObj2.map((tagObject) => {
          if (tagObject.INDEX === tag.INDEX) {
            tagObject.VLAN_ID = value;
          }
          return tagObject;
        });
        setFormData({ ...formData, INGRESS_RULES: formData.INGRESS_RULES.map((rule, index) => (index === currentIngressRule ? { ...rule, REWRITE: { ...rule.REWRITE, PUSH_TAGS: tagsObj2 } } : rule)) });
        break;

      default:
        break;
    }
  };
  useEffect(() => {
    setValidity(formValidity?.REWRITE?.PUSH_TAGS[tag.INDEX]);
  }, [formValidity, tag.INDEX]);
  return (
    <div className="row mb-5">
      <div className="form-group col-md-4">
        <label htmlFor="tagINDEX">Tag index:</label>
        <input className="form-control " id="tagINDEX" name="INDEX" value={tag.INDEX} disabled onChange={updateRule}></input>
      </div>
      <div className="form-group col-md-4">
        <label htmlFor="vlanType">Vlan type/ethertype:</label>
        <select className="form-control " id="vlanType" name="TagType" value={tag.TYPE} onChange={updateRule}>
          <option value="c-vlan">c-vlan</option>
          <option value="s-vlan">s-vlan</option>
        </select>
      </div>
      <div className="form-group col-md-4">
        <label htmlFor="vlanID">Vlan ID:</label>
        <input type="number" className={'form-control ' + validity?.VLAN_ID} id="vlanID" name="vlanID" value={tag.VLAN_ID} onChange={updateRule}></input>
        {validity?.vlan_IDError ? <div className="invalid-feedback">{validity?.vlan_IDError}</div> : null}
      </div>
      <div className="form-group col-md-4">
        <label htmlFor="pbit-from-tag-index">pbit-from-tag-index:</label>
        <input type="number" className="form-control " id="pbit-from-tag-index" name="pbit-from-tag-index" value="" disabled></input>
      </div>
      <div className="form-group col-md-4">
        <label htmlFor="write-pbit-0">write-pbit-0 :</label>
        <input type="number" className="form-control " id="write-pbit-0" name="write-pbit-0" value="" disabled></input>
      </div>
      <div className="form-group col-md-4">
        <label htmlFor="write-dei-0">write-dei-0:</label>
        <input type="number" className="form-control " id="write-dei-0" name="write-dei-0" value="" disabled></input>
      </div>
    </div>
  );
}

export default PushTagForm;
