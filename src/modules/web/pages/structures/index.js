import React, { useState, useEffect } from 'react';
import { ProfilerConsumer } from '../../../../context/profileContext'
import { Typography } from '@material-ui/core';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { v4 as uuidv4 } from 'uuid';
import { withTranslation } from 'react-i18next';
import TableViewComponent from '../../../../components/TableViewComponent'
import { useNavigate } from 'react-router-dom'

import {
  AddStructure,
  SaveStructure,
  SetUserStructures,
  GetStructures
} from "../../../../helpers/db";


const structureSchema = [
  { title: 'Nome', field: 'name' },
  { title: 'Telefono', field: 'phone' }
]

function Structures(props) {
  const [userStructures, setUserStructures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [first_structure_name, setFirstStructureName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const ids = props.user.structures ? props.user.structures.map( (s) => s.ref.id) : [];

    GetStructures(ids).then( (querySnapshot) => {
      let structures = [];
      querySnapshot.forEach( (doc) => {
        const data = doc.data();
        structures.push({id: doc.id, ref: doc.ref, name: data.name, phone: data.phone});
      });
      setUserStructures(structures);
    })
  }, [props.user.structures]);

  const saveStructure = (data) => {
    setLoading(true);
    const structureIndex = data.tableData.id;
    const structure = userStructures[structureIndex];
    const s = {
      id: structure.ref.id,
      name: data.name,
      phone: data.phone
    }
    const structures = userStructures;
    const index = structures.findIndex(s => s.id === data.id);
    structures[index].name = data.name;
    SaveStructure(s).then(
      setLoading(false)
      /*SetUserStructures(structures, props.user.id).then( () => {
        setUserStructures(structures);
        navigate('/dashboard');
      }).catch(error => {
        console.error('Create New Structure error', error);
      })*/
      //getUsers(false)
    ).catch(error => {
      setLoading(false)
      console.error('Create New Structure error', error);
    });
  }

  const addStructure = (data) => {
    if (!data.name) {
      setErrorMsg("Inserire il nome del centro");
      return;
    }
    data.id = data.id ? data.id : uuidv4();
    let s = {
      id: data.id,
      name: data.name,
      phone: data.phone,
      creator_id: props.user.id,
    }
    setLoading(true);
    AddStructure(s).then( (docRef) => {
        docRef.collection("services").add({id: 1, active: true, name: "Servizio di esempio", price: 1, duration:30, category: "base"}).then( () => {
          console.log("Servizio di esempio aggiunto")
        });
        docRef.collection("users").add({id: 1, lastname: "Esempio", name: "Utente"}).then( () => {
          console.log("Utente di esempio aggiunto")
        });
        const newStructure = {
          id: s.id,
          name: s.name,
          ref: docRef,
          role: "admin"
        }
        let newStructures = userStructures;
        newStructures.push(newStructure);
        SetUserStructures(newStructures, props.user.id).then( () => {
          setUserStructures(newStructures);
          navigate('/dashboard');
          setLoading(false);
          //getUsers(false)
        }).catch(error => {
          setLoading(false);
          console.error('Create New Structure error', error);
        })
      }
      //getUsers(false)
    ).catch(error => {
      console.error('Create New Structure error', error);
    });
  }


  const deleteUserStructures = (data) => {
    const newStructures = userStructures.filter(s => s.id !== data.id);
    SetUserStructures(newStructures, props.user.id).then(
      setUserStructures(newStructures)
    ).catch(error => {
      console.error('Create New Structure error', error);
    })
  }

  return (
    <ProfilerConsumer>
      {context => {
        if (context.email) {
          return (
            <div>
              {  (errorMsg !== "") &&
                <Alert severity="error">{errorMsg}</Alert>
              }
              <h1>Le tue strutture</h1>
              <Typography variant="subtitle1">Ciao {props.user.email}</Typography>
              {
                (!props.user.structures || (props.user.structures && props.user.structures.length === 0)) &&
                <div>
                  <br />
                  <Typography variant="subtitle2">Per iniziare è necessario aggiungere il nome del tuo centro</Typography>
                  <Box
                    component="form"
                    sx={{
                      '& > :not(style)': { m: 1, width: '35ch' },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    
                    <TextField id="first_structure_name" required onChange={ (e) => setFirstStructureName(e.target.value)} label="Nome del tuo centro" variant="outlined" />
                  </Box>
                  <Box sx={{
                      '& > :not(style)': { m: 1, width: '35ch' },
                    }}>
                    <LoadingButton
                        color="secondary"
                        onClick={() => { addStructure({name: first_structure_name}) }}
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        variant="contained"
                      >
                        <span>{props.t("Save")}</span>
                      </LoadingButton>
                  </Box>
                </div>
              }
              {
                (props.user.structures && props.user.structures.length > 0) &&
              <TableViewComponent
                onAdd={addStructure}
                onEdit={saveStructure}
                onDelete={deleteUserStructures}
                data={userStructures} 
                columns={structureSchema}/>
              }
            </div>
          )
        }
      }}
    </ProfilerConsumer>
  )
}

export default withTranslation()(Structures);
