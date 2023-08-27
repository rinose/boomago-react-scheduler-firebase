import React, { Component } from 'react';
import uuidV4 from 'uuid/v4'
import { withTranslation } from 'react-i18next';
import TableViewComponent from '../../../../components/TableViewComponent'
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
//Actions
import {
  GetResources,
  UpdateResources,
  DeleteResource
} from "../../../../helpers/db";

class ResourcesManager extends Component {

  constructor(props) {
    super(props)

    this.state = {
      resources: []
    }
    this.schema = [];
    this.categories = [];
  }

  componentDidMount() {
    this.getResources();
  }

  setResource(resource) {
    UpdateResources(resource.id).set(resource).then(
      //this.updateResources()
    ).catch(error => {
      console.error('Create New Equipment error', error);
    });
  }

  onCreateResource = (resource) => {
    resource.id = resource.id ? resource.id : uuidV4();
    this.setResource(resource);
  }
  onEditResource = (resource) => {
    this.setResource(resource);
    //this.updateResources();
  }
  onDeleteResource = (resource) => {
    DeleteResource(resource.id).then(
      //this.updateResources()
    ).catch(error => {
      console.error('Create New Equipment error', error);
    });
  }

  /*updateResources() {
    this.getResources();
  }*/
  getResources() {
    let newResources = [];
    GetResources(true).then(querySnapshot => {
      var source = querySnapshot.metadata.fromCache ? "local cache" : "server";
      console.log("Data came from " + source);
      this.categories = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        newResources.push(data);
        if(data.category && !(data.category in this.categories)) {
          this.categories.push({"title": data.category});
        }
      });
      this.initSchema();
      this.setState({
        resources: newResources,
      })
    })
  }

  initSchema() {
    const { t } = this.props;
    this.schema= [
      { title: 'Nome', field: 'name', defaultSort: 'asc' },
      { 
        title: 'Categoria',
        field: 'category',
        editComponent: props => (
          <Autocomplete
          id="category"
          options={this.categories.sort((a, b) => -b.title.localeCompare(a.title))}
          getOptionLabel={option => option.title}
          freeSolo
          renderInput={params => (
            <TextField {...params} 
            value={props.value}
            onChange={e => props.onChange(e.target.value)}
            label={t("Category")}
            margin="normal" 
            variant="outlined" 
            fullWidth />
          )}
        />
        )
      },
      { title: 'Descrizione', field: 'description'},
      { title: 'Attivo', field: 'active', type: 'boolean'}
    ]
  }

  render() {
    const { t } = this.props;
    const { resources } = this.state;
    return (
      <div>
        <div><strong>{t("Resources")}</strong></div>
        { (resources.length > 0) &&
        <TableViewComponent
          onAdd={this.onCreateResource}
          onEdit={this.onEditResource}
          onDelete={this.onDeleteResource}
          data={resources}
          columns={this.schema}/>
        }
      </div>
    )
  }

}

export default withTranslation()(ResourcesManager);
