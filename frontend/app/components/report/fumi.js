var fumiForm = {
	content: [
		{ 
			image: 'sampleImage.jpg',
			alignment: 'left',
			width: 50,
			height: 50,
		},
		{ 
		    
			text: 'HORN TECHNOLOGIES &SERVICES, INC.', 
			style: 'header' ,
			alignment: 'center' 
		},
		{ 
			text: '2020 S. Golden State Blvd suite 103 – Fowler – California 93625', 
			style: 'small' ,
			alignment: 'center' 
		},
		{ 
			text: 'TEL.: (559) 316-7034', 
			style: 'small' ,
			alignment: 'center' 
		},
		{ 
			text: 'Web: www.horn-technologies.com | e-mail: info@horn-technologies.com', 
			style: 'small' ,
			alignment: 'center' 
		},
		" "," ",
		{
			text: 'Fumigation Certificate',
			style: 'subheader',
			alignment: 'center'
		},
		" "," ",
		{
		    text: "This is to certify that the commodity listed below has been fumigated"
		},
		" "," ",
		{
			id : "treatment",
		    text: "TREATMENT N: "
		},
        " ",
		{
			id : "customer",
		    text: "CUSTOMER NAME: "
		},
        " ",
		{
			id : "container",
		    text: "CONTAINER N°/ Lot #(s): "
		},
		" "," ",
		{
			id: "commodity",
		    text: "COMMODITY: "
		},
        " ",
		{
			id : "fumigant",
		    text: "FUMIGANT: "
		},
        " ",
		{
			id : "dosage",
		    text: "DOSAGE RATE: "
		},
        " ",
		{
			id : "startTime",
		    text: "START DATE/Time : "
		},
        " ",
		{
			id : "endTime",
		    text: "END DATE/Time : "
		},
        " ",
		{
			id : "exposure",
		    text: "EXPOSURE: "
		},
        " ",
		{
			id : "certGas",
		    text: "CERTIFIED GAS FREE AT: "
		},
		" "," ",
		{
			id : "fumigator",
		    text: "FUMIGATOR: "
		},
		" "," "," "," ",
		{
		    text: "________________________________",
		    alignment: 'right'
		},
		{
		    text: "SIGNATURE OF FUMIGATOR",
		    alignment: 'right',
		    pageBreak: 'after'
		},
	],
	styles: {
		header: {
			fontSize: 18,
			bold: true
		},
		subheader: {
			fontSize: 15,
			bold: true
		},
		quote: {
			italics: true
		},
		small: {
			fontSize: 9
		}
	}
}