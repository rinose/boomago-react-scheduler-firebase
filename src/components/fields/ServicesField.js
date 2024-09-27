import React from 'react'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withTranslation } from 'react-i18next';

export class ServicesField extends React.Component {

  render() {
    const { t, services } = this.props;
    if (services.length === 0) return(<div></div>);
    var defaultValue = services.filter( (item) => { return this.props.defaultValue && this.props.defaultValue.includes(item.id )} );
    defaultValue = defaultValue ? defaultValue : "";
    return(
      <Autocomplete
          multiple
          options={services.sort((a, b) => -b.id.localeCompare(a.id))}
          getOptionLabel={option => option.name}
          filterSelectedOptions
          value={defaultValue}
          onChange={(e, obj) => {
            if(obj) {
              //const ids = obj.map( (item) => { return item.id} );
              this.props.onChange(obj);
            }
          }}
          renderInput={params => (
            <TextField {...params} 
            label={t("Services")}
            margin="normal" 
            variant="outlined" 
            fullWidth />
          )}
        />
    );
  }
}

export default withTranslation()(ServicesField);
