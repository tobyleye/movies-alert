 

 create table if not exists movie_subscriptions (
    id varchar(255) primary key,
    movie_title varchar(255) not null,
    email varchar(255) not null,
    status enum('pending', 'done')
    created varchar(255) not null
  );

  create table if not exists movies (
    id varchar(255) primary key,
    title varchar(255) not null,
    description text default null,
    link varchar(255) default null,
    source varchar(255) default null,
    created varchar(255) not null
  );

  create table if not exists movies_crawler_config {
    last_crawled_movie_title varchar(255) default null,
    last_crawled_movie_link varchar(255) default null,
    updated_timestamp varchar(255) default null
  }