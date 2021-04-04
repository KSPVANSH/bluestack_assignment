CREATE DATABASE bluestack_assignment;
use blusestack_assignment;
Create table Channel (channel_id int primary key AUTO_INCREMENT, channel_title TEXT, subscribers int);
Create table Video ( video_id int primary key AUTO_INCREMENT,channel_id int ,Video_URL varchar(200), Video_Thumbnail varchar(220), Video_Title text, Description text, Viewcount varchar(220), foreign key(channel_id) references Channel(channel_id));
