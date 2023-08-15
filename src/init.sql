 create table if not exists movie_subscriptions (
    id varchar(255) primary key,
    movie_title varchar(255) not null,
    created varchar(255) not null
  );

  create table if not exists movies (
    id varchar(255) primary key,
    title varchar(255) not null,
    description text default null,
    link varchar(255) default null,
    created varchar(255) not null
  );