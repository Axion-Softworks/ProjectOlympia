using AutoMapper;

namespace ProjectOlympia
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<AthleteCsvData, Athlete>()
                .ForCtorParam("medals", o => o.MapFrom(k => new List<Medal>()));

            CreateMap<AddPlayerRequest, Player>();
            CreateMap<UpdatePlayerRequest, Player>();
            CreateMap<AddDraftRequest, Draft>();
            CreateMap<UpdateDraftRequest, Draft>();
            CreateMap<UpdateAthleteRequest, Athlete>();

            CreateMap<Draft, AddDraftResponse>();
            CreateMap<Athlete, AssignAthleteResponse>();

            CreateMap<Draft, DraftData>();
            CreateMap<Player, PlayerData>();
            CreateMap<Medal, MedalData>();
            CreateMap<Athlete, AthleteData>();
        }
    }
}